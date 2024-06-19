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
mod commands;
mod dirstat;
mod metrics;
mod models;
mod plugins;
mod tray;
mod utils;

use app::AppState;
use tauri::menu::Menu;

use std::time::Duration;

fn build_and_run_app(app: AppState) {
    tauri::Builder::default()
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

            //  CONFIGURE WINDOW
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

            // BUILD TRAY - TODO MOVE TO DIFFERENT FILE

            let _ = tray::create_tray(app);

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                window.hide().unwrap();
                api.prevent_close();
            }
            tauri::WindowEvent::DragDrop { .. } => todo!(),

            _ => {}
        })
        .manage(app)
        .invoke_handler(tauri::generate_handler![
            commands::kill_process,
            commands::show_folder,
            commands::delete_folder,
            commands::disk_analysis_flattened,
            commands::add_pachtop_exclusion,
            commands::disk_scan,
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
