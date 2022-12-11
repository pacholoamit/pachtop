#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod app;
mod metrics;
mod models;
mod sqlite;
mod utils;

use app::AppState;

use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

fn build_and_run_app(app: AppState) {
    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(
            SystemTrayMenu::new().add_item(CustomMenuItem::new("quit".to_string(), "Quit")),
        ))
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
        .manage(AppState::new())
        // .manage(app) // ! delete later
        .invoke_handler(tauri::generate_handler![
            app::get_sysinfo,
            app::get_global_cpu,
            app::get_memory,
            app::get_swap,
            app::get_networks,
            app::get_cpus,
            app::get_disks,
            app::get_processes,
            app::kill_process
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    let app = AppState::new();
    build_and_run_app(app);
}
