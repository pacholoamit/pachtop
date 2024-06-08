#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
mod mac;

#[cfg(target_os = "windows")]
mod win;

mod app;
pub mod db;
mod dirstat;
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

    let window_state_plugin = tauri_plugin_window_state::Builder::default().build();

    let single_instance_plugin = tauri_plugin_single_instance::init(|app, _argv, _cwd| {
        let window = app.get_window("main").unwrap();
        if window.is_visible().unwrap() {
            window.set_focus().unwrap();
        } else {
            window.show().unwrap();
        }
    });

    let system_tray = SystemTray::new()
        .with_menu(SystemTrayMenu::new().add_item(CustomMenuItem::new("quit".to_string(), "Quit")));

    tauri::Builder::default()
        .plugin(log_plugin)
        .plugin(store_plugin)
        .plugin(auto_start_plugin)
        .plugin(window_state_plugin)
        .plugin(single_instance_plugin)
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
                    std::thread::sleep(Duration::from_secs(1))
                }
            });

            if cfg!(target_os = "macos") {
                #[cfg(target_os = "macos")]
                use mac::window::setup_mac_window;

                #[cfg(target_os = "macos")]
                setup_mac_window(app);
            } else if cfg!(target_os = "windows") {
                #[cfg(target_os = "windows")]
                use win::window::setup_win_window;

                #[cfg(target_os = "windows")]
                setup_win_window(app);
            }

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
            app::show_folder,
            app::delete_folder,
            app::disk_turbo_scan,
            app::disk_analysis_flattened,
            app::disk_scan,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let app = AppState::new();

    db::db::init().await?;

    build_and_run_app(app);

    Ok(())
}
