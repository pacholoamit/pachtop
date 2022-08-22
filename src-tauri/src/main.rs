#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod metrics;
mod models;

use metrics::MetricsState;
fn main() {
    tauri::Builder::default()
        .manage(MetricsState::default())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![metrics::get_memory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
