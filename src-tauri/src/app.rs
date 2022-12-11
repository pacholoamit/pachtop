use std::sync::{Arc, Mutex};

use sysinfo::{System, SystemExt};
use tauri::State;

use crate::{metrics::Metrics, models::SysInfo};

pub struct AppState {
    pub metrics: Arc<Mutex<Metrics>>,
    // pub sqlite:
}

impl AppState {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();

        AppState {
            metrics: Arc::new(Mutex::new(Metrics { sys })),
            // sqlite:
        }
    }
}

#[tauri::command]
pub fn get_sysinfo(state: State<'_, AppState>) -> SysInfo {
    state.metrics.lock().unwrap().sysinfo()
}
