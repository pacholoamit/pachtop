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
fn memory() -> Result<models::Memory, String> {
    match Metrics::new().memory() {
        Ok(mem) => Ok(mem),
        Err(_) => Err("Error while getting memory info".to_string()),
    }
}
