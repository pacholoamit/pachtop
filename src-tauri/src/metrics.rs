extern crate systemstat;
use crate::models::Memory;

use chrono::prelude::*;
use std::sync::{Arc, Mutex};
use sysinfo::{System, SystemExt};

use tauri::State;

#[tauri::command]
pub fn get_memory(state: State<'_, MetricsState>) -> Memory {
    state.0.lock().unwrap().memory()
}

pub struct MetricsState(Arc<Mutex<Metrics>>);

impl Default for MetricsState {
    fn default() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        MetricsState(Arc::new(Mutex::new(Metrics { sys })))
    }
}

struct Metrics {
    sys: System,
}

impl Metrics {
    fn memory(&self) -> Memory {
        let free = bytes_to_size(self.sys.free_memory());
        let total = bytes_to_size(self.sys.total_memory());
        let used = bytes_to_size(self.sys.used_memory());
        Memory {
            free,
            total,
            used,
            timestamp: get_timestamp(),
        }
    }
}

fn get_timestamp() -> String {
    Local::now().time().to_string()
}

fn bytes_to_size(bytes: u64) -> u64 {
    bytes / 1024 / 1024
}
