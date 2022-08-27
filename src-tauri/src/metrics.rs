use crate::models::Memory;

use byte_unit::{AdjustedByte, Byte, ByteUnit};
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
    fn memory(&self) -> Memory {
        let unit = ByteUnit::GB;
        let free_b = kb_to_size(self.sys.free_memory(), &unit);

        dbg!(&free_b);
        // *Refactor implementation below to be like above

        let free = kb_to_size(self.sys.free_memory(), &unit);
        let total = kb_to_size(self.sys.total_memory(), &unit);
        let used = kb_to_size(self.sys.used_memory(), &unit);

        dbg!(&free);

        Memory {
            free: 1,
            total: 1,
            used: 1,
            timestamp: get_timestamp(),
        }
    }
}

fn get_timestamp() -> String {
    Local::now().time().to_string()
}

fn kb_to_size(kb: u64, dest_unit: &ByteUnit) -> AdjustedByte {
    Byte::from_unit(kb as f64, ByteUnit::KB)
        .unwrap()
        .get_adjusted_unit(dest_unit.clone()) // * Possibly modify Memory struct to hold unit & value for result of get_adjusted_unit
}
