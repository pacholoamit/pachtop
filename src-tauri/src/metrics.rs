use crate::models::Memory;

use byte_unit::{Byte, ByteUnit};
use chrono::prelude::*;
use std::sync::{Arc, Mutex};
use sysinfo::{System, SystemExt};
use tauri::State;

#[tauri::command]
pub fn get_memory(state: State<'_, MetricsState>) -> Memory {
    state.0.lock().unwrap().memory()
}

pub struct MetricsState(Arc<Mutex<Metrics>>);

impl MetricsState {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        MetricsState(Arc::new(Mutex::new(Metrics { sys })))
    }
}

struct Metrics {
    sys: System,
}

impl Metrics {
    fn memory(&mut self) -> Memory {
        self.sys.refresh_memory();
        let unit = ByteUnit::GB;
        let free = kb_to_size(self.sys.free_memory(), &unit);
        let total = kb_to_size(self.sys.total_memory(), &unit);
        let used = kb_to_size(self.sys.used_memory(), &unit);

        Memory {
            free,
            total,
            used,
            unit,
            timestamp: current_time(),
        }
    }
}

fn current_time() -> String {
    let now = Local::now();
    now.format("%H:%M:%S").to_string()
}

fn kb_to_size(kb: u64, dest_unit: &ByteUnit) -> f64 {
    Byte::from_unit(kb as f64, ByteUnit::KB)
        .unwrap()
        .get_adjusted_unit(*dest_unit)
        .get_value()
}
