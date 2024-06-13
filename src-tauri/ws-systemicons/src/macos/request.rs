use crate::Error;
use cocoa::{
    base::{id, nil, YES},
    foundation::NSSize,
};
use objc::{class, msg_send, sel, sel_impl};
use std::path::Path;
use std::{
    env,
    fs::{self, File},
};
use std::{ffi::CString, io::Read};

#[repr(u64)]
#[derive(Clone, Copy, Debug, PartialEq)]
enum NSBitmapImageFileType {
    NSBitmapImageFileTypePNG = 4,
}

pub fn get_icon(ext: &str, size: f64) -> Result<Vec<u8>, Error> {
    let filename = get_icon_as_file(ext, size)?;
    let mut f = File::open(&filename)?;
    let metadata = fs::metadata(&filename)?;
    let mut buffer = vec![0; metadata.len() as usize];

    f.read_exact(&mut buffer)?;
    Ok(buffer)
}

pub fn get_icon_as_file(ext: &str, size: f64) -> Result<String, Error> {
    unsafe {
        // convert &str to NSString
        let ns_source_path: id =
            msg_send![class!(NSString), stringWithCString: CString::new(ext).unwrap()];

        let temp_out_path = format!(
            "{}{}.png",
            env::temp_dir().to_str().unwrap(),
            Path::new(ext).file_name().unwrap().to_str().unwrap()
        );

        let ns_out_path: id = msg_send![class!(NSString), stringWithCString: CString::new(temp_out_path.as_str()).unwrap() ];

        // get shared workspace
        let ns_workspace: id = msg_send![class!(NSWorkspace), sharedWorkspace];

        // get app icon
        let ns_image: id = msg_send![ns_workspace, iconForFile: ns_source_path];

        // set size
        let _: () = msg_send![ns_image, setSize: NSSize::new(size, size)];

        let cg_ref: id = msg_send![ns_image, CGImageForProposedRect:nil context:nil hints:nil];
        let ns_bitmap_image_ref: id = msg_send![class!(NSBitmapImageRep), alloc];
        let image_rep: id = msg_send![ns_bitmap_image_ref, initWithCGImage: cg_ref];
        let image_dimension: id = msg_send![ns_image, size];
        let _: () = msg_send![image_rep, setSize: image_dimension];

        let png_data: id = msg_send![image_rep, representationUsingType:NSBitmapImageFileType::NSBitmapImageFileTypePNG properties:nil];
        let _: () = msg_send![png_data, writeToFile:ns_out_path atomically:YES];
        let _: () = msg_send![image_rep, autorelease];

        Ok(temp_out_path.to_string())
    }
}
