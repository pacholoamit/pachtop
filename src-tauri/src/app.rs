use std::sync::{Arc, Mutex};

use tauri::State;

use crate::{metrics::Metrics, models::SysInfo};

pub struct AppConfig {
    pub metrics: Arc<Mutex<Metrics>>,
    // pub sqlite:
}

impl AppConfig {
    pub fn new(metrics_state: Arc<Mutex<Metrics>>) -> Self {
        AppConfig {
            metrics: metrics_state,
            // sqlite:
        }
    }
}

#[tauri::command]
pub fn get_sysinfo(state: State<'_, AppConfig>) -> SysInfo {
    state.metrics.lock().unwrap().sysinfo()
}
