use log::info;
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

#[derive(Default)]
pub struct App {
    pub metrics: Metrics,
}

impl AppState {
    pub fn emit_sysinfo(&self, window: &Window) {
        let sys_info = self.0.lock().unwrap().metrics.get_system_information();
        let sys_info_log = serde_json::to_string(&sys_info).unwrap();

        info!("sys_info: {}", sys_info_log);
        window.emit("emit_sysinfo", &sys_info).unwrap();
    }

    pub fn emit_global_cpu(&self, window: &Window) {
        let global_cpu = self.0.lock().unwrap().metrics.get_global_cpu();

        window.emit("emit_global_cpu", &global_cpu).unwrap();
    }

    pub fn emit_cpus(&self, window: &Window) {
        let cpus = self.0.lock().unwrap().metrics.get_cpus();
        window.emit("emit_cpus", &cpus).unwrap();
    }

    pub fn emit_memory(&self, window: &Window) {
        let memory = self.0.lock().unwrap().metrics.get_memory();
        window.emit("emit_memory", &memory).unwrap();
    }

    pub fn emit_swap(&self, window: &Window) {
        let swap = self.0.lock().unwrap().metrics.get_swap();
        window.emit("emit_swap", &swap).unwrap();
    }

    pub fn emit_networks(&self, window: &Window) {
        let networks = self.0.lock().unwrap().metrics.get_networks();
        window.emit("emit_networks", &networks).unwrap();
    }

    pub fn emit_disks(&self, window: &Window) {
        let disks = self.0.lock().unwrap().metrics.get_disks();
        window.emit("emit_disks", &disks).unwrap();
    }

    pub fn emit_processes(&self, window: &Window) {
        let processes = self.0.lock().unwrap().metrics.get_processes();
        window.emit("emit_processes", &processes).unwrap();
    }
}

#[tauri::command]
pub fn kill_process(state: State<'_, AppState>, pid: String) -> bool {
    let killed = state.0.lock().unwrap().metrics.kill_process(pid);

    killed
}
