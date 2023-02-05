use std::sync::{Arc, Mutex};

use rusqlite::params;
use tauri::State;

use crate::metrics::Metrics;
use crate::models::*;
use crate::sqlite::Sqlite;
use crate::utils::current_time;

pub struct AppState(Arc<Mutex<App>>);

impl AppState {
    pub fn new() -> Self {
        AppState(Arc::new(Mutex::new(App::default())))
    }
}

pub struct App {
    pub metrics: Metrics,
    pub sqlite: Sqlite,
}

impl Default for App {
    fn default() -> Self {
        App {
            metrics: Metrics::default(),
            sqlite: Sqlite::new().expect("Failed to create sqlite connection"),
        }
    }
}

#[tauri::command]
pub fn get_sysinfo(state: State<'_, AppState>) -> SysInfo {
    state.0.lock().unwrap().metrics.get_system_information()
}

#[tauri::command]
pub fn get_global_cpu(state: State<'_, AppState>) -> GlobalCpu {
    state.0.lock().unwrap().metrics.get_global_cpu()
}

#[tauri::command]
pub fn get_cpus(state: State<'_, AppState>) -> Vec<Cpu> {
    state.0.lock().unwrap().metrics.get_cpus()
}

#[tauri::command]
pub fn get_memory(state: State<'_, AppState>) -> Memory {
    state.0.lock().unwrap().metrics.get_memory()
}

#[tauri::command]
pub fn get_swap(state: State<'_, AppState>) -> Swap {
    state.0.lock().unwrap().metrics.get_swap()
}

#[tauri::command]
pub fn get_networks(state: State<'_, AppState>) -> Vec<Network> {
    state.0.lock().unwrap().metrics.get_networks()
}
#[tauri::command]
pub fn get_disks(state: State<'_, AppState>) -> Vec<Disk> {
    state.0.lock().unwrap().metrics.get_disks()
}

#[tauri::command]
pub fn get_processes(state: State<'_, AppState>) -> Vec<Process> {
    state.0.lock().unwrap().metrics.get_processes()
}

#[tauri::command]
pub fn kill_process(state: State<'_, AppState>, pid: String) -> bool {
    state.0.lock().unwrap().metrics.kill_process(pid)
}
