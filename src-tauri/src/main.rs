#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use app::{models, Metrics};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![memory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn memory() -> models::Memory {
    Metrics::new().memory().unwrap()
}
