use log::info;
use std::sync::{Arc, Mutex};
use tauri::{api, State, Window};

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
    let killed = state.0.lock().unwrap().metrics.kill_process(&pid);

    info!(
        "Running kill_process command, pid: {}, killed: {}",
        &pid, killed
    );
    killed
}

#[tauri::command]
pub fn read_config(_state: State<'_, AppState>) -> Config {
    // TODO: deduplicate this , this is also on main.rs
    let config_path = match api::path::config_dir().unwrap().to_str() {
        Some(path) => format!("{}/{}", path, "config.json"),
        None => String::from(""),
    };

    let config_string = match api::file::read_string(config_path) {
        Ok(data) => data,
        Err(e) => {
            info!("Error reading config file: {}", e);
            String::from("")
        }
    };

    println!("config_string: {}", config_string);

    match serde_json::from_str(&config_string) {
        Ok(data) => data,
        Err(e) => {
            info!("Error parsing config file: {}", e);
            Config::default()
        }
    }
}
