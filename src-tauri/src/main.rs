#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

extern crate systemstat;

use app::Metrics;
use serde::{Deserialize, Serialize};
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![memory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
#[derive(Debug, Serialize, Deserialize)]
struct Memory {
    free: u64,
    total: u64,
    used: u64,
}
#[tauri::command]
fn memory() -> Memory {
    let mem = Metrics::new().memory();

    Memory {
        free: mem.free.as_u64(),
        total: mem.total.as_u64(),
        used: mem.total.as_u64() - mem.free.as_u64(),
    }
}
