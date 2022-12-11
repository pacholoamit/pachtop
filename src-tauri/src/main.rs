#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod app;
mod metrics;
mod models;

use std::sync::{Arc, Mutex};

use app::App;

use metrics::{Metrics, MetricsState};
use sysinfo::{System, SystemExt};
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

fn build_and_run_app(app: App) {
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
        .manage(app)
        .manage(MetricsState::new()) // ! delete later
        .invoke_handler(tauri::generate_handler![
            app::get_sysinfo,
            metrics::get_global_cpu,
            metrics::get_memory,
            metrics::get_swap,
            metrics::get_networks,
            metrics::get_cpus,
            metrics::get_disks,
            metrics::get_processes,
            metrics::kill_process
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    let metrics_state = Arc::new(Mutex::new(Metrics {
        sys: System::new_all(),
    }));
    let config = App::new(metrics_state);
    build_and_run_app(config);
}
