use std::sync::{Arc, Mutex};

use tauri::State;

use crate::{metrics::Metrics, models::SysInfo};

pub struct App {
    pub metrics: Arc<Mutex<Metrics>>,
    // pub sqlite:
}

impl App {
    pub fn new(metrics_state: Arc<Mutex<Metrics>>) -> Self {
        App {
            metrics: metrics_state,
            // sqlite:
        }
    }
}

#[tauri::command]
pub fn get_sysinfo(state: State<'_, App>) -> SysInfo {
    state.metrics.lock().unwrap().sysinfo()
}
