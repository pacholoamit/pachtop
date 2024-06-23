use anyhow::Ok;
use tauri::{
    menu::MenuItemBuilder,
    tray::{MouseButton, TrayIconEvent},
    App, Manager,
};

pub fn create_tray(app: &mut App) -> anyhow::Result<()> {
    let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;

    let icon = app.default_window_icon().unwrap().clone();

    let menu = tauri::menu::MenuBuilder::new(app).items(&[&quit]).build()?;

    let _tray = tauri::tray::TrayIconBuilder::with_id("tray")
        .tooltip("Pachtop")
        .icon(icon)
        .menu(&menu)
        .on_menu_event(move |app, event| match event.id().as_ref() {
            "quit" => {
                app.exit(0);
            }
            "example" => todo!(),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
        })
        .build(app)?;
    Ok(())
}
