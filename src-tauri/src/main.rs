#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod app;
mod metrics;
mod models;
mod utils;

use app::AppState;
use log::{error, info};
use std::time::Duration;
use tauri::api::path::cache_dir;
use tauri::{api, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_log::LogTarget;

use crate::models::Config;

fn setup_app() -> std::io::Result<()> {
    let config_path = match api::path::config_dir().unwrap().to_str() {
        Some(path) => format!("{}/{}", path, "config.json"),
        None => String::from(""),
    };

    match std::fs::metadata(&config_path) {
        Ok(_) => info!("Config file exists at: {}", &config_path),
        Err(e) => {
            error!("Error checking config file: {}", e);
            info!("Attempting to create config file at: {}", &config_path);

            let default = Config::default();
            let default_config = serde_json::to_string_pretty(&default).unwrap();

            std::fs::write(&config_path, default_config)?;
            info!("Created config file at: {}", &config_path);
        }
    }

    Ok(())
}

fn build_and_run_app(app: AppState) {
    info!("Cache Directory: {:?}", cache_dir().unwrap());

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Folder(cache_dir().unwrap()), LogTarget::Stdout])
                .build(),
        )
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
            app::kill_process,
            app::read_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() -> std::io::Result<()> {
    let app = AppState::new();
    setup_app()?;
    build_and_run_app(app);

    Ok(())
}
