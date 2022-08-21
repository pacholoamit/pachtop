#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use app::{models, Metrics};
use std::thread;
fn main() {
    thread::spawn(|| {
        let metrics = Metrics::new();
        loop {
            let mem = metrics.memory().unwrap();
            println!("{:?}", mem);
            thread::sleep(std::time::Duration::from_secs(1));
        }
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
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
