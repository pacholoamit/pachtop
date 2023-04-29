#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod app;
mod metrics;
mod models;
mod utils;

use app::AppState;

use std::time::Duration;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

fn build_and_run_app(app: AppState) {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let state = AppState::new();

            tauri::async_runtime::spawn(async move {
                loop {
                    state.emit_sysinfo(&window);
                    state.emit_global_cpu(&window);
                    state.emit_cpus(&window);
                    state.emit_memory(&window);
                    state.emit_swap(&window);
                    state.emit_networks(&window);
                    state.emit_disks(&window);
                    state.emit_processes(&window);
                    std::thread::sleep(Duration::from_secs(1));
                }
            });

            Ok(())
        })
        .system_tray(SystemTray::new().with_menu(
            SystemTrayMenu::new().add_item(CustomMenuItem::new("quit".to_string(), "Quit")),
        ))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").unwrap();
                if id.as_str() == "quit" {
                    window.close().unwrap();
                }
            }
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        })
        .on_window_event(|event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
                event.window().hide().unwrap();
                api.prevent_close();
            }
        })
        .manage(app)
        .invoke_handler(tauri::generate_handler![
            // app::get_sysinfo,
            // app::get_global_cpu,
            // app::get_memory,
            // app::get_swap,
            // app::get_networks,
            // app::get_cpus,
            // app::get_disks,
            // app::get_processes,
            app::kill_process
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    let app = AppState::new();
    build_and_run_app(app);
}
