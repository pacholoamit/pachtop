#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod metrics;
mod models;

use byte_unit::ByteUnit;
use metrics::MetricsState;
use sysinfo::{System, SystemExt};

fn main() {
    let target_unit = ByteUnit::GB;
    let mut sys = System::new_all();
    sys.refresh_all();

    tauri::Builder::default()
        .manage(MetricsState::new(sys, target_unit))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            metrics::get_sysinfo,
            metrics::get_memory,
            metrics::get_swap
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
