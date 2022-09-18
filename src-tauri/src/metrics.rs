use crate::models::{Memory, Swap};

use byte_unit::{Byte, ByteUnit};
use chrono::prelude::*;
use std::sync::{Arc, Mutex};
use sysinfo::{System, SystemExt};
use tauri::State;

#[tauri::command]
pub fn get_memory(state: State<'_, MetricsState>) -> Memory {
    state.0.lock().unwrap().memory()
}

#[tauri::command]
pub fn get_swap(state: State<'_, MetricsState>) -> Swap {
    state.0.lock().unwrap().swap()
}

pub struct MetricsState(Arc<Mutex<Metrics>>);

impl MetricsState {
    pub fn new(sys: System, target_unit: ByteUnit) -> Self {
        MetricsState(Arc::new(Mutex::new(Metrics { sys, target_unit })))
    }
}

struct Metrics {
    sys: System,
    target_unit: ByteUnit,
}

impl Metrics {
    fn memory(&mut self) -> Memory {
        self.sys.refresh_memory();

        let free = bytes_to_size(self.sys.free_memory(), &self.target_unit);
        let total = bytes_to_size(self.sys.total_memory(), &self.target_unit);
        let used = bytes_to_size(self.sys.used_memory(), &self.target_unit);

        println!("{}", &free);

        Memory {
            free,
            total,
            used,
            unit: self.target_unit,
            timestamp: current_time(),
        }
    }

    fn swap(&mut self) -> Swap {
        self.sys.refresh_memory();
        let total = bytes_to_size(self.sys.total_swap(), &self.target_unit);
        let used = bytes_to_size(self.sys.used_swap(), &self.target_unit);
        let free = bytes_to_size(self.sys.free_swap(), &self.target_unit);

        Swap {
            free,
            total,
            used,
            unit: self.target_unit,
            timestamp: current_time(),
        }
    }
}

fn current_time() -> String {
    let now = Local::now();
    now.format("%H:%M:%S %Y-%m-%d").to_string()
}

fn bytes_to_size(bytes: u64, dest_unit: &ByteUnit) -> f64 {
    let result = Byte::from_unit(bytes as f64, ByteUnit::B)
        .unwrap()
        .get_adjusted_unit(*dest_unit)
        .get_value();

    (result * 100.0).round() / 100.0 // round to 2 decimal places
}
