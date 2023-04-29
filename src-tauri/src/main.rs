#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod app;
mod metrics;
mod models;
mod utils;

use app::AppState;
use log::info;
use notify::{RecommendedWatcher, RecursiveMode, Result, Watcher};
use std::time::Duration;
use tauri::api::path::cache_dir;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_log::LogTarget;

fn build_and_run_app(app: AppState) -> Result<()> {
    println!("Cache Directory: {:?}", cache_dir().unwrap());

    tauri::async_runtime::spawn(async move {
        let mut watcher = notify::recommended_watcher(|res| match res {
            Ok(event) => print!("{:?}", event),
            Err(e) => print!("watch error: {:?}", e),
        })
        .unwrap();

        watcher
            .watch(cache_dir().unwrap().as_path(), RecursiveMode::NonRecursive)
            .unwrap();
    });

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Folder(cache_dir().unwrap())])
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
        .invoke_handler(tauri::generate_handler![app::kill_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

fn main() -> Result<()> {
    let app = AppState::new();
    build_and_run_app(app)?;

    Ok(())
}
