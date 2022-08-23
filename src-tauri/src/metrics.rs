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
    // *Possibly find way to make conversion of ByteUnits dynamic through
    // *config file
    fn memory(&self) -> Memory {
        let free_b = kb_to_size(self.sys.free_memory(), ByteUnit::GB);

        dbg!(&free_b);
        // *Refactor implementation below to be like above

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

fn kb_to_size(kb: u64, dest_unit: ByteUnit) -> String {
    Byte::from_unit(kb as f64, ByteUnit::KB)
        .unwrap()
        .get_adjusted_unit(dest_unit)
        .to_string()
}

fn bytes_to_size(bytes: u64) -> u64 {
    bytes / 1024 / 1024
}
