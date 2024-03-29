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
use tauri::api::path::cache_dir;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_log::LogTarget;

fn build_and_run_app(app: AppState) {
    let log_plugin = tauri_plugin_log::Builder::default()
        .targets([LogTarget::Folder(cache_dir().unwrap()), LogTarget::Stdout])
        .build();

    let store_plugin = tauri_plugin_store::Builder::default().build();

    let auto_start_plugin = tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec![]));

    let system_tray = SystemTray::new()
        .with_menu(SystemTrayMenu::new().add_item(CustomMenuItem::new("quit".to_string(), "Quit")));

    tauri::Builder::default()
        .plugin(log_plugin)
        .plugin(store_plugin)
        .plugin(auto_start_plugin)
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
        .system_tray(system_tray)
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
            app::kill_process,
            app::show_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() -> std::io::Result<()> {
    let app = AppState::new();

    build_and_run_app(app);

    Ok(())
}
