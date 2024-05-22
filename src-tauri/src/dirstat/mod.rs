pub mod ffi;

use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::ffi::OsStr;
use std::fs;
use std::path::Path;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Once};
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

#[derive(Serialize, Deserialize, Debug, TS, Clone, Copy)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/lib/bindings/")]

pub struct DiskItemMetadata {
    #[ts(type = "number")]
    pub size: u64,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct DiskItem {
    pub id: String,
    pub name: String,
    pub children: Option<Vec<DiskItem>>,
    pub metadata: DiskItemMetadata,
}

impl DiskItem {
    pub fn from_analyze(
        path: &Path,
        apparent: bool,
        root_dev: u64,
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
                        DiskItem::from_analyze(&entry.path(), apparent, root_dev).ok()
                    })
                    .collect();

                let mut sorted_sub_items = sub_items;
                sorted_sub_items
                    .sort_unstable_by(|a, b| a.metadata.size.cmp(&b.metadata.size).reverse());

                Ok(DiskItem {
                    id,
                    name,
                    metadata: DiskItemMetadata {
                        size: sorted_sub_items.iter().map(|di| di.metadata.size).sum(),
                    },
                    children: Some(sorted_sub_items),
                })
            }
            FileInfo::File { size, .. } => Ok(DiskItem {
                id,
                name,
                metadata: DiskItemMetadata { size },
                children: None,
            }),
        }
    }

    pub fn from_analyze_callback(
        path: &Path,
        apparent: bool,
        root_dev: u64,
        callback: Arc<dyn Fn(&DiskItem) + Send + Sync>,
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
                        match DiskItem::from_analyze_callback(
                            &entry.path(),
                            apparent,
                            root_dev,
                            Arc::clone(&callback),
                        ) {
                            Ok(item) => {
                                callback(&item);
                                Some(item)
                            }
                            Err(_) => None,
                        }
                    })
                    .collect();

                let mut sorted_sub_items = sub_items;
                sorted_sub_items
                    .sort_unstable_by(|a, b| a.metadata.size.cmp(&b.metadata.size).reverse());

                let item = DiskItem {
                    id,
                    name,
                    metadata: DiskItemMetadata {
                        size: sorted_sub_items.iter().map(|di| di.metadata.size).sum(),
                    },
                    children: Some(sorted_sub_items),
                };

                callback(&item);

                Ok(item)
            }
            FileInfo::File { size, .. } => {
                let item = DiskItem {
                    id,
                    name,
                    metadata: DiskItemMetadata { size },
                    children: None,
                };

                callback(&item);

                Ok(item)
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
