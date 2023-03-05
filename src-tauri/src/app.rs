use std::sync::{Arc, Mutex};

use tauri::{State, Window};

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
}

impl Default for App {
    fn default() -> Self {
        App {
            metrics: Metrics::default(),
        }
    }
}

#[tauri::command]
pub fn get_sysinfo(state: State<'_, AppState>) -> SysInfo {
    let sys_info = state.0.lock().unwrap().metrics.get_system_information();
    sys_info
}

#[tauri::command]
pub fn get_global_cpu(state: State<'_, AppState>) -> GlobalCpu {
    let global_cpu = state.0.lock().unwrap().metrics.get_global_cpu();
    global_cpu
}

#[tauri::command]
pub fn get_cpus(state: State<'_, AppState>) -> Vec<Cpu> {
    let cpus = state.0.lock().unwrap().metrics.get_cpus();
    cpus
}

#[tauri::command]
pub fn get_memory(state: State<'_, AppState>) -> Memory {
    let memory = state.0.lock().unwrap().metrics.get_memory();

    memory
}

#[tauri::command]
pub fn get_swap(state: State<'_, AppState>) -> Swap {
    let swap = state.0.lock().unwrap().metrics.get_swap();

    swap
}

#[tauri::command]
pub fn get_networks(state: State<'_, AppState>) -> Vec<Network> {
    let networks = state.0.lock().unwrap().metrics.get_networks();

    networks
}
#[tauri::command]
pub fn get_disks(state: State<'_, AppState>) -> Vec<Disk> {
    let disks = state.0.lock().unwrap().metrics.get_disks();

    disks
}

#[tauri::command]
pub fn get_processes(state: State<'_, AppState>) -> Vec<Process> {
    let processes = state.0.lock().unwrap().metrics.get_processes();

    processes
}

#[tauri::command]
pub fn kill_process(state: State<'_, AppState>, pid: String) -> bool {
    let killed = state.0.lock().unwrap().metrics.kill_process(pid);

    killed
}

pub fn emit_server_event(window: &Window) {
    window.emit("server-event", "Hello from Rust").unwrap();
}
