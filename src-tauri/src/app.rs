use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

use sysinfo::{System, SystemExt};
use tauri::{Manager, State, Window};

use crate::metrics::Metrics;
use crate::models::*;

pub struct AppState(Arc<Mutex<App>>);

impl AppState {
    pub fn new() -> Self {
        AppState(Arc::new(Mutex::new(App::default())))
    }
}

pub struct App {
    pub metrics: Metrics,
    // pub sqlite:
}

impl Default for App {
    fn default() -> Self {
        App {
            metrics: Metrics::default(),
            // sqlite: Sqlite::default(),
        }
    }
}

// #[tauri::command]
// pub fn get_sysinfo(state: State<'_, App>, window: Window) {
//     let mut metrics = state.metrics.lock().unwrap();
//     let info = metrics.sysinfo();
//     thread::spawn(move || loop {
//         window.emit("get_sysinfo", &info).unwrap();
//         thread::sleep(Duration::from_secs(1));
//     });
// }

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
