use gio_sys::GThemedIcon;
use glib::{gobject_ffi::g_object_unref, object::GObject};
use glib_sys::g_free;
use gtk_sys::{
    gtk_icon_info_get_filename, gtk_icon_theme_choose_icon, gtk_icon_theme_get_default,
    GtkIconTheme, GTK_ICON_LOOKUP_NO_SVG,
};
use std::{
    ffi::{c_void, CStr, CString},
    fs::{self, File},
    io::Read,
};

use crate::{Error, InnerError};

static mut DEFAULT_THEME: Option<*mut GtkIconTheme> = None;

pub fn get_icon(ext: &str, size: i32) -> Result<Vec<u8>, Error> {
    let filename = get_icon_as_file(ext, size)?;
    let mut f = File::open(&filename)?;
    let metadata = fs::metadata(&filename)?;
    let mut buffer = vec![0; metadata.len() as usize];
    f.read(&mut buffer)?;
    Ok(buffer)
}

pub fn get_icon_as_file(ext: &str, size: i32) -> Result<String, Error> {
    let result: String;
    unsafe {
        let filename = CString::new(ext).unwrap();
        let null: u8 = 0;
        let p_null = &null as *const u8;
        let nullsize: usize = 0;
        let mut res = 0;
        let p_res = &mut res as *mut i32;
        let p_res = gio_sys::g_content_type_guess(filename.as_ptr(), p_null, nullsize, p_res);
        let icon = gio_sys::g_content_type_get_icon(p_res);
        g_free(p_res as *mut c_void);
        if DEFAULT_THEME.is_none() {
            let theme = gtk_icon_theme_get_default();
            if theme.is_null() {
                println!("You have to initialize GTK!");
                return Err(Error {
                    message: "You have to initialize GTK!".to_string(),
                    inner_error: InnerError::GtkInitError,
                });
            }
            let theme = gtk_icon_theme_get_default();
            DEFAULT_THEME = Some(theme);
        }
        let icon_names =
            gio_sys::g_themed_icon_get_names(icon as *mut GThemedIcon) as *mut *const i8;
        let icon_info = gtk_icon_theme_choose_icon(
            DEFAULT_THEME.unwrap(),
            icon_names,
            size,
            GTK_ICON_LOOKUP_NO_SVG,
        );
        let filename = gtk_icon_info_get_filename(icon_info);
        let res_str = CStr::from_ptr(filename);
        result = res_str.to_str()?.to_string();
        g_object_unref(icon as *mut GObject);
    }
    Ok(result)
}

pub fn init() {
    gtk::init().unwrap();
}
