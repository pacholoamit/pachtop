use anyhow::Ok;
use tauri::{menu::MenuItemBuilder, App, Manager};

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
        .on_tray_icon_event(|tray, event| match event {
            tauri::tray::TrayIconEvent::Click { button, .. } => match button {
                tauri::tray::MouseButton::Left => {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                tauri::tray::MouseButton::Middle => todo!(),
                _ => {}
            },
            tauri::tray::TrayIconEvent::Leave { .. } => todo!(),
            _ => {}
        })
        .build(app)?;
    Ok(())
}
