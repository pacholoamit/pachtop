use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use crate::dirstat::DiskItem;
use crate::metrics::Metrics;
use crate::models::*;
use tauri::Emitter;

pub struct AppState(pub Arc<Mutex<App>>);

impl AppState {
    pub fn new() -> Self {
        AppState(Arc::new(Mutex::new(App::default())))
    }
}

#[derive(Default)]
pub struct DiskStore {
    pub analysis: HashMap<String, DiskItem>,
}

#[derive(Default)]
pub struct AppStore {
    pub disk: DiskStore,
}

#[derive(Default)]
pub struct App {
    pub metrics: Metrics,
    pub store: AppStore,
}

impl AppState {
    pub fn set_disk_analysis(&self, name: String, disk_analysis: DiskItem) {
        self.0
            .lock()
            .unwrap()
            .store
            .disk
            .analysis
            .insert(name, disk_analysis);
    }
    pub fn emit_sysinfo(&self, app: &tauri::AppHandle) {
        let sys_info = self.0.lock().unwrap().metrics.get_system_information();
        app.emit("emit_sysinfo", &sys_info).unwrap();
    }

    pub fn emit_global_cpu(&self, app: &tauri::AppHandle) {
        let global_cpu = self.0.lock().unwrap().metrics.get_global_cpu();
        app.emit("emit_global_cpu", &global_cpu).unwrap();
    }

    pub fn emit_cpus(&self, app: &tauri::AppHandle) {
        let cpus = self.0.lock().unwrap().metrics.get_cpus();
        app.emit("emit_cpus", &cpus).unwrap();
    }

    pub fn emit_memory(&self, app: &tauri::AppHandle) {
        let memory = self.0.lock().unwrap().metrics.get_memory();
        app.emit("emit_memory", &memory).unwrap();
    }

    pub fn emit_swap(&self, app: &tauri::AppHandle) {
        let swap = self.0.lock().unwrap().metrics.get_swap();
        app.emit("emit_swap", &swap).unwrap();
    }

    pub fn emit_networks(&self, app: &tauri::AppHandle) {
        let networks = self.0.lock().unwrap().metrics.get_networks();
        app.emit("emit_networks", &networks).unwrap();
    }

    pub fn emit_disks(&self, app: &tauri::AppHandle) {
        let disks = self.0.lock().unwrap().metrics.get_disks();
        app.emit("emit_disks", &disks).unwrap();
    }

    pub fn emit_processes(&self, app: &tauri::AppHandle) {
        let processes = self.0.lock().unwrap().metrics.get_processes();
        app.emit("emit_processes", &processes).unwrap();
    }
}
