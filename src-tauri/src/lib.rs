#[cfg(target_os = "macos")]
#[macro_use]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

mod app;
mod commands;
mod dirstat;
mod metrics;
mod models;
mod plugins;
mod tray;
mod utils;

use app::AppState;
use tauri::Manager;
use tauri_plugin_decorum::WebviewWindowExt;

use std::time::Duration;

fn build_and_run_app(app: AppState) {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let handle = app.handle().clone();
            let state = AppState::new();

            #[cfg(desktop)]
            plugins::setup_plugins(app)?;

            tauri::async_runtime::spawn(async move {
                loop {
                    state.emit_sysinfo(&handle);
                    state.emit_global_cpu(&handle);
                    state.emit_cpus(&handle);
                    state.emit_memory(&handle);
                    state.emit_swap(&handle);
                    state.emit_networks(&handle);
                    state.emit_disks(&handle);
                    state.emit_processes(&handle);
                    std::thread::sleep(Duration::from_secs(1))
                }
            });

            let main_window = app.get_webview_window("main").unwrap();
            main_window.create_overlay_titlebar().unwrap();

            // Some macOS-specific helpers
            #[cfg(target_os = "macos")]
            main_window.set_traffic_lights_inset(12.0, 24.0).unwrap();

            // BUILD TRAY - TODO MOVE TO DIFFERENT FILE

            let _ = tray::create_tray(app);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                window.hide().unwrap();
                api.prevent_close();
            }
        })
        .manage(app)
        .invoke_handler(tauri::generate_handler![
            commands::kill_process,
            commands::open,
            commands::delete_file,
            commands::delete_folder,
            commands::disk_analysis_flattened,
            commands::add_pachtop_exclusion,
            commands::disk_scan,
            commands::show_in_terminal,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[tokio::main]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = AppState::new();

    // db::db::init().await?;

    build_and_run_app(app);
}
