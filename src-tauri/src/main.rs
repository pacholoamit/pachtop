#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod metrics;
mod models;

use metrics::MetricsState;
use sysinfo::{System, SystemExt};
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};
use tauri_plugin_log::{LogTarget, LoggerBuilder};

fn main() {
    let mut sys = System::new_all();

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);
    let tray = SystemTray::new().with_menu(tray_menu);
    let window_state_plugin = tauri_plugin_window_state::Builder::default().build();
    let logger_plugin = LoggerBuilder::default()
        .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
        .build();

    sys.refresh_all();

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").unwrap();
                match id.as_str() {
                    "quit" => {
                        window.close().unwrap();
                    }
                    _ => {}
                }
            }
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .manage(MetricsState::new(sys))
        .plugin(window_state_plugin)
        .plugin(logger_plugin)
        .invoke_handler(tauri::generate_handler![
            metrics::get_sysinfo,
            metrics::get_global_cpu,
            metrics::get_memory,
            metrics::get_swap,
            metrics::get_networks,
            metrics::get_cpus,
            metrics::get_disks,
            metrics::get_processes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
