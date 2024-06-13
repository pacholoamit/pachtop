use crate::Error;
use image::ImageFormat;
use std::{mem, ptr, time};
use winapi::{
    shared::{
        minwindef::LPVOID,
        windef::{HBITMAP, HGDIOBJ, HICON},
    },
    um::{
        shellapi::{
            ExtractIconExW, SHGetFileInfoW, SHFILEINFOW, SHGFI_ICON, SHGFI_LARGEICON,
            SHGFI_SMALLICON, SHGFI_TYPENAME, SHGFI_USEFILEATTRIBUTES,
        },
        wingdi::{DeleteObject, GetBitmapBits, GetObjectW, BITMAP, BITMAPINFOHEADER, PBITMAP},
        winnt::{FILE_ATTRIBUTE_NORMAL, HANDLE},
        winuser::{DestroyIcon, GetIconInfo, ICONINFO},
    },
    STRUCT,
};

pub fn get_icon(ext: &str, size: i32) -> Result<Vec<u8>, Error> {
    fn get_icon_from_ext(ext: &str, size: i32) -> HICON {
        unsafe {
            let p_path = utf_16_null_terminiated(ext);
            let mut file_info = SHFILEINFOW {
                dwAttributes: 0,
                hIcon: ptr::null_mut(),
                iIcon: 0,
                szDisplayName: [0 as u16; 260],
                szTypeName: [0; 80],
            };
            let file_info_size = mem::size_of_val(&file_info) as u32;
            for _ in 0..3 {
                // Sporadically this method returns 0!
                SHGetFileInfoW(
                    p_path.as_ptr(),
                    FILE_ATTRIBUTE_NORMAL,
                    &mut file_info,
                    file_info_size,
                    SHGFI_ICON
                        | SHGFI_USEFILEATTRIBUTES
                        | SHGFI_TYPENAME
                        | if size > 16 {
                            SHGFI_LARGEICON
                        } else {
                            SHGFI_SMALLICON
                        },
                );
                if file_info.hIcon != ptr::null_mut() {
                    break;
                } else {
                    let millis = time::Duration::from_millis(30);
                    std::thread::sleep(millis);
                }
            }
            file_info.hIcon
        }
    }

    fn extract_icon(path: &str, size: i32) -> HICON {
        unsafe {
            let mut icon_large: HICON = ptr::null_mut();
            let mut icon_small: HICON = ptr::null_mut();
            let path = utf_16_null_terminiated(path);
            ExtractIconExW(path.as_ptr(), 0, &mut icon_large, &mut icon_small, 1);
            if size > 16 {
                DestroyIcon(icon_small);
                icon_large
            } else {
                DestroyIcon(icon_large);
                icon_small
            }
        }
    }
    unsafe {
        let mut icon = if ext.to_lowercase().ends_with(".exe") {
            let mut icon = extract_icon(ext, size);
            if icon == ptr::null_mut() {
                if let Some(pos) = ext.find(".exe") {
                    icon = get_icon_from_ext(&ext[pos..], size);
                } else {
                    icon = extract_icon("C:\\Windows\\system32\\SHELL32.dll", size);
                }
            }
            icon
        } else {
            get_icon_from_ext(ext, size)
        };
        if icon == ptr::null_mut() {
            icon = extract_icon("C:\\Windows\\system32\\SHELL32.dll", size);
        }
        let mut icon_info = ICONINFO {
            fIcon: 0,
            hbmColor: ptr::null_mut(),
            hbmMask: ptr::null_mut(),
            xHotspot: 0,
            yHotspot: 0,
        };
        GetIconInfo(icon, &mut icon_info);
        DestroyIcon(icon);

        let mut bmp_color = BITMAP {
            bmBits: ptr::null_mut(),
            bmBitsPixel: 0,
            bmHeight: 0,
            bmPlanes: 0,
            bmType: 0,
            bmWidth: 0,
            bmWidthBytes: 0,
        };
        GetObjectW(
            icon_info.hbmColor as HANDLE,
            mem::size_of_val(&bmp_color) as i32,
            &mut bmp_color as PBITMAP as LPVOID,
        );
        let mut bmp_mask = BITMAP {
            bmBits: ptr::null_mut(),
            bmBitsPixel: 0,
            bmHeight: 0,
            bmPlanes: 0,
            bmType: 0,
            bmWidth: 0,
            bmWidthBytes: 0,
        };
        GetObjectW(
            icon_info.hbmMask as HANDLE,
            mem::size_of_val(&bmp_mask) as i32,
            &mut bmp_mask as PBITMAP as LPVOID,
        );

        fn get_bitmap_count(bitmap: &BITMAP) -> i32 {
            let mut n_width_bytes = bitmap.bmWidthBytes;
            // bitmap scanlines MUST be a multiple of 4 bytes when stored
            // inside a bitmap resource, so round up if necessary
            if n_width_bytes & 3 != 0 {
                n_width_bytes = (n_width_bytes + 4) & !3;
            }

            n_width_bytes * bitmap.bmHeight
        }

        let icon_header_size = mem::size_of::<ICONHEADER>();
        let icon_dir_size = mem::size_of::<ICONDIR>();
        let info_header_size = mem::size_of::<BITMAPINFOHEADER>();
        let bitmap_bytes_count = get_bitmap_count(&bmp_color) as usize;
        let mask_bytes_count = get_bitmap_count(&bmp_mask) as usize;

        let complete_size = icon_header_size
            + icon_dir_size
            + info_header_size
            + bitmap_bytes_count
            + mask_bytes_count;

        let image_bytes_count = bitmap_bytes_count + mask_bytes_count;
        let mut bytes = Vec::<u8>::with_capacity(complete_size);
        bytes.set_len(complete_size);

        let iconheader = ICONHEADER {
            id_count: 1, // number of ICONDIRs
            id_reserved: 0,
            id_type: 1, // Type 1 = ICON (type 2 = CURSOR)
        };
        let byte_ptr: *mut u8 = mem::transmute(&iconheader);
        ptr::copy_nonoverlapping(byte_ptr, bytes.as_mut_ptr(), icon_header_size);
        let pos = icon_header_size;

        let color_count = if bmp_color.bmBitsPixel >= 8 {
            0
        } else {
            1 << (bmp_color.bmBitsPixel * bmp_color.bmPlanes)
        };

        // Create the ICONDIR structure
        let icon_dir = ICONDIR {
            b_width: bmp_color.bmWidth as u8,
            b_height: bmp_color.bmHeight as u8,
            b_color_count: color_count,
            b_reserved: 0,
            w_planes: bmp_color.bmPlanes,
            w_bit_count: bmp_color.bmBitsPixel,
            dw_image_offset: (icon_header_size + 16) as u32,
            dw_bytes_in_res: (mem::size_of::<BITMAPINFOHEADER>() + image_bytes_count) as u32,
        };

        let byte_ptr: *mut u8 = mem::transmute(&icon_dir);
        ptr::copy_nonoverlapping(byte_ptr, bytes[pos..].as_mut_ptr(), icon_dir_size);
        let pos = pos + icon_dir_size;

        let bi_header = BITMAPINFOHEADER {
            biSize: info_header_size as u32,
            biWidth: bmp_color.bmWidth,
            biHeight: bmp_color.bmHeight * 2, // height of color+mono
            biPlanes: bmp_color.bmPlanes,
            biBitCount: bmp_color.bmBitsPixel,
            biSizeImage: image_bytes_count as u32,
            biClrImportant: 0,
            biClrUsed: 0,
            biCompression: 0,
            biXPelsPerMeter: 0,
            biYPelsPerMeter: 0,
        };
        let byte_ptr: *mut u8 = mem::transmute(&bi_header);
        ptr::copy_nonoverlapping(byte_ptr, bytes[pos..].as_mut_ptr(), info_header_size);
        let pos = pos + info_header_size;

        // write the RGBQUAD color table (for 16 and 256 colour icons)
        if bmp_color.bmBitsPixel == 2 || bmp_color.bmBitsPixel == 8 {}

        write_icon_data_to_memory(
            &mut bytes[pos..],
            icon_info.hbmColor,
            &bmp_color,
            bitmap_bytes_count as usize,
        );
        let pos = pos + bitmap_bytes_count as usize;
        write_icon_data_to_memory(
            &mut bytes[pos..],
            icon_info.hbmMask,
            &bmp_mask,
            mask_bytes_count as usize,
        );

        let im = image::load_from_memory(&bytes)?;
        let mut png_bytes: Vec<u8> = Vec::new();
        im.write_to(&mut png_bytes, ImageFormat::Png)?;

        DeleteObject(icon_info.hbmColor as HGDIOBJ);
        DeleteObject(icon_info.hbmMask as HGDIOBJ);

        Ok(png_bytes)
    }
}

fn utf_16_null_terminiated(x: &str) -> Vec<u16> {
    x.encode_utf16().chain(std::iter::once(0)).collect()
}

STRUCT! {#[debug] struct ICONHEADER {
    id_reserved: i16,
    id_type: i16,
    id_count: i16,
}}

STRUCT! {#[debug] struct ICONDIR {
    b_width: u8,
    b_height: u8,
    b_color_count: u8,
    b_reserved: u8,
    w_planes: u16, // for cursors, this field = wXHotSpot
    w_bit_count: u16, // for cursors, this field = wYHotSpot
    dw_bytes_in_res: u32,
    dw_image_offset: u32, // file-offset to the start of ICONIMAGE
}}

fn write_icon_data_to_memory(
    mem: &mut [u8],
    h_bitmap: HBITMAP,
    bmp: &BITMAP,
    bitmap_byte_count: usize,
) {
    unsafe {
        let mut icon_data = Vec::<u8>::with_capacity(bitmap_byte_count);
        icon_data.set_len(bitmap_byte_count);

        GetBitmapBits(
            h_bitmap,
            bitmap_byte_count as i32,
            icon_data.as_mut_ptr() as LPVOID,
        );

        // bitmaps are stored inverted (vertically) when on disk..
        // so write out each line in turn, starting at the bottom + working
        // towards the top of the bitmap. Also, the bitmaps are stored in packed
        // in memory - scanlines are NOT 32bit aligned, just 1-after-the-other
        let mut pos = 0;
        for i in (0..bmp.bmHeight).rev() {
            // Write the bitmap scanline

            ptr::copy_nonoverlapping(
                icon_data[(i * bmp.bmWidthBytes) as usize..].as_ptr(),
                mem[pos..].as_mut_ptr(),
                bmp.bmWidthBytes as usize,
            ); // 1 line of BYTES
            pos += bmp.bmWidthBytes as usize;

            // extend to a 32bit boundary (in the file) if necessary
            if bmp.bmWidthBytes & 3 != 0 {
                let padding: [u8; 4] = [0; 4];
                ptr::copy_nonoverlapping(
                    padding.as_ptr(),
                    mem[pos..].as_mut_ptr(),
                    (4 - bmp.bmWidthBytes) as usize,
                );
                pos += 4 - bmp.bmWidthBytes as usize;
            }
        }
    }
}
