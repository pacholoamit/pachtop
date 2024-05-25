#![cfg(windows)]

use std::error::Error;
use std::iter::once;
use std::os::windows::ffi::OsStrExt;
use std::path::Path;

use winapi::um::fileapi::GetCompressedFileSizeW;
use winapi::um::fileapi::INVALID_FILE_SIZE;
use windows::Win32::Foundation::GetLastError;

pub fn compressed_size(path: &Path) -> Result<u64, Box<dyn Error>> {
    let wide: Vec<u16> = path.as_os_str().encode_wide().chain(once(0)).collect();
    let mut high: u32 = 0;

    // TODO: Deal with max path size
    let low = unsafe { GetCompressedFileSizeW(wide.as_ptr(), &mut high) };

    if low == INVALID_FILE_SIZE {
        let err = unsafe { GetLastError() };

        match err {
            Ok(_) => {
                println!("No error")
            }
            Err(e) => {
                return Err(e.into());
            }
        }
    }

    Ok(u64::from(high) << 32 | u64::from(low))
}
