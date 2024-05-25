pub mod ffi;

use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::error::Error;
use std::ffi::OsStr;
use std::fs;
use std::path::Path;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex, Once};
use ts_rs::TS;
#[cfg(target_os = "windows")]
use winapi_util::{file, Handle};

static INIT: Once = Once::new();
static mut COUNTER: Option<AtomicU64> = None;

fn get_next_id() -> String {
    unsafe {
        INIT.call_once(|| {
            COUNTER = Some(AtomicU64::new(1));
        });
        COUNTER
            .as_ref()
            .expect("COUNTER is not initialized")
            .fetch_add(1, Ordering::SeqCst)
            .to_string()
    }
}

#[derive(Serialize, Deserialize, Debug, TS, Default, Clone)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct DiskItem {
    pub id: String,
    pub name: String,
    pub children: Option<Vec<DiskItem>>,
    #[ts(type = "number")]
    pub size: u64,
}

// Define a type alias for the callback
type ProgressCallback = dyn Fn(u64, u64) + Send + Sync;

impl DiskItem {
    pub fn flatten(&self, max_records: usize) -> Vec<DiskItem> {
        let flattened_tree = Arc::new(Mutex::new(vec![]));
        let unique_check = Arc::new(Mutex::new(HashSet::new()));
        let internal_count = Arc::new(Mutex::new(0));

        fn flatten_tree_helper(
            item: &DiskItem,
            parent_id: Option<String>,
            flattened_tree: Arc<Mutex<Vec<DiskItem>>>,
            unique_check: Arc<Mutex<HashSet<String>>>,
            internal_count: Arc<Mutex<u64>>,
        ) -> DiskItem {
            let mut node = item.clone();

            {
                let mut internal_count = internal_count.lock().unwrap();
                if node.id.is_empty() {
                    node.id = internal_count.to_string();
                }
                *internal_count += 1;
            }

            {
                let mut unique_check = unique_check.lock().unwrap();
                if !unique_check.insert(node.id.clone()) {
                    panic!(
                        "Multiple DiskItem nodes have the same ID ({}). IDs must be unique.",
                        node.id
                    );
                }
            }

            if let Some(ref children) = node.children {
                children.par_iter().for_each(|child| {
                    flatten_tree_helper(
                        child,
                        Some(node.id.clone()),
                        Arc::clone(&flattened_tree),
                        Arc::clone(&unique_check),
                        Arc::clone(&internal_count),
                    );
                });
            } else {
                let mut flattened_tree = flattened_tree.lock().unwrap();
                flattened_tree.push(node.clone());
            }

            node
        }

        flatten_tree_helper(
            self,
            None,
            Arc::clone(&flattened_tree),
            Arc::clone(&unique_check),
            Arc::clone(&internal_count),
        );

        let mut result = Arc::try_unwrap(flattened_tree)
            .unwrap()
            .into_inner()
            .unwrap();
        // Sort the items by size in descending order
        result.sort_unstable_by(|a, b| b.size.cmp(&a.size));

        // Truncate the result to the max_records specified
        if result.len() > max_records {
            result.truncate(max_records);
        }

        result
    }

    pub fn from_analyze(
        path: &Path,
        apparent: bool,
        root_dev: u64,
        callback: &ProgressCallback,
        total_bytes: u64,
        bytes_scanned: Arc<AtomicU64>,
    ) -> Result<Self, Box<dyn Error>> {
        let id = get_next_id();
        let name = path
            .file_name()
            .unwrap_or(OsStr::new("."))
            .to_string_lossy()
            .to_string();

        let file_info = FileInfo::from_path(path, apparent)?;

        match file_info {
            FileInfo::Directory { volume_id } => {
                if volume_id != root_dev {
                    return Err("Filesystem boundary crossed".into());
                }

                let sub_entries = fs::read_dir(path)?
                    .filter_map(Result::ok)
                    .collect::<Vec<_>>();

                let sub_items: Vec<DiskItem> = sub_entries
                    .into_par_iter()
                    .filter_map(|entry| {
                        let result = DiskItem::from_analyze(
                            &entry.path(),
                            apparent,
                            root_dev,
                            callback,
                            total_bytes,
                            Arc::clone(&bytes_scanned),
                        );

                        result.ok()
                    })
                    .collect();

                let mut sorted_sub_items = sub_items;
                sorted_sub_items.sort_unstable_by(|a, b| a.size.cmp(&b.size).reverse());

                Ok(DiskItem {
                    id,
                    name,
                    size: sorted_sub_items.iter().map(|item| item.size).sum(),
                    children: Some(sorted_sub_items),
                })
            }
            FileInfo::File { size, .. } => {
                bytes_scanned.fetch_add(size, Ordering::SeqCst);
                callback(bytes_scanned.load(Ordering::SeqCst), total_bytes);
                Ok(DiskItem {
                    id,
                    name,
                    size,
                    children: None,
                })
            }
        }
    }
}

pub enum FileInfo {
    File { size: u64, volume_id: u64 },
    Directory { volume_id: u64 },
}

impl FileInfo {
    #[cfg(unix)]
    pub fn from_path(path: &Path, apparent: bool) -> Result<Self, Box<dyn Error>> {
        use std::os::unix::fs::MetadataExt;

        let md = path.symlink_metadata()?;
        if md.is_dir() {
            Ok(FileInfo::Directory {
                volume_id: md.dev(),
            })
        } else {
            let size = if apparent {
                md.blocks() * 512
            } else {
                md.len()
            };
            Ok(FileInfo::File {
                size,
                volume_id: md.dev(),
            })
        }
    }

    #[cfg(windows)]
    pub fn from_path(path: &Path, apparent: bool) -> Result<Self, Box<dyn Error>> {
        const FILE_ATTRIBUTE_DIRECTORY: u64 = 0x10;

        let h = Handle::from_path_any(path)?;
        let md = file::information(h)?;

        if md.file_attributes() & FILE_ATTRIBUTE_DIRECTORY != 0 {
            Ok(FileInfo::Directory {
                volume_id: md.volume_serial_number(),
            })
        } else {
            let size = if apparent {
                ffi::compressed_size(path)?
            } else {
                md.file_size()
            };
            Ok(FileInfo::File {
                size,
                volume_id: md.volume_serial_number(),
            })
        }
    }
}
