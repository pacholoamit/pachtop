use crate::dirstat::ffi;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::ffi::OsStr;
use std::fs;
use std::path::Path;
use winapi_util::{file, Handle};

#[derive(Serialize, Deserialize, Debug)]
pub struct DiskItem {
    pub name: String,
    pub disk_size: u64,
    pub children: Option<Vec<DiskItem>>,
}

impl DiskItem {
    pub fn from_analyze(
        path: &Path,
        apparent: bool,
        root_dev: u64,
    ) -> Result<Self, Box<dyn Error>> {
        let name = path
            .file_name()
            .unwrap_or(&OsStr::new("."))
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

                let mut sub_items = sub_entries
                    .par_iter()
                    .filter_map(|entry| {
                        DiskItem::from_analyze(&entry.path(), apparent, root_dev).ok()
                    })
                    .collect::<Vec<_>>();

                sub_items.sort_unstable_by(|a, b| a.disk_size.cmp(&b.disk_size).reverse());

                Ok(DiskItem {
                    name,
                    disk_size: sub_items.iter().map(|di| di.disk_size).sum(),
                    children: Some(sub_items),
                })
            }
            FileInfo::File { size, .. } => Ok(DiskItem {
                name,
                disk_size: size,
                children: None,
            }),
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
