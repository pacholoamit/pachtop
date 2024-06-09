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
mod dirstat;
mod metrics;
mod models;
mod utils;

use app::AppState;

use std::time::Duration;
// use tauri::api::path::cache_dir;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    Manager,
};
use tauri_plugin_autostart::MacosLauncher;
// use tauri_plugin_log::LogTarget;

fn build_and_run_app(app: AppState) {
    // let log_plugin = tauri_plugin_log::Builder::default()
    //     .targets([LogTarget::Folder(cache_dir().unwrap()), LogTarget::Stdout])
    //     .build();

    let store_plugin = tauri_plugin_store::Builder::default().build();

    let auto_start_plugin =
        tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--silently"]));

    let window_state_plugin = tauri_plugin_window_state::Builder::default().build();

    let single_instance_plugin = tauri_plugin_single_instance::init(|app, _argv, _cwd| {
        let window = app.get_webview_window("main").unwrap();
        if window.is_visible().unwrap() {
            window.set_focus().unwrap();
        } else {
            window.show().unwrap();
        }
    });

    tauri::Builder::default()
        // .plugin(log_plugin)
        .plugin(store_plugin)
        .plugin(auto_start_plugin)
        .plugin(window_state_plugin)
        .plugin(single_instance_plugin)
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            let handle = app.handle().clone();
            let state = AppState::new();

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

            // BUILD TRAY

            let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            let show = MenuItemBuilder::with_id("show", "Show").build(app)?;

            let menu = tauri::menu::MenuBuilder::new(app)
                .items(&[&show, &quit])
                .build()?;

            let tray = tauri::tray::TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(move |app, event| match event.id().as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.show().unwrap();
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| match event {
                    tauri::tray::TrayIconEvent::Click { id, button, .. } => match button {
                        tauri::tray::MouseButton::Left => {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        _ => {}
                    },
                    _ => {}
                })
                .build(app)?;
            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
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

// #[tokio::main]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = AppState::new();

    // db::db::init().await?;

    build_and_run_app(app);
}