use crate::models::{Memory, Swap, SysInfo};

use byte_unit::{Byte, ByteUnit};

use std::{
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};
use sysinfo::{System, SystemExt};
use tauri::State;

#[tauri::command]
pub fn get_sysinfo(state: State<'_, MetricsState>) -> SysInfo {
    state.0.lock().unwrap().sysinfo()
}

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
    fn sysinfo(&mut self) -> SysInfo {
        self.sys.refresh_all();

        let kernel_version = self
            .sys
            .kernel_version()
            .unwrap_or_else(|| "Unknown".to_string());
        let os_version = self
            .sys
            .long_os_version()
            .unwrap_or_else(|| "Unknown".to_string());
        let hostname = self
            .sys
            .host_name()
            .unwrap_or_else(|| "Unknown".to_string());

        SysInfo {
            kernel_version,
            os_version,
            hostname,
            timestamp: current_time(),
        }
    }
    fn memory(&mut self) -> Memory {
        self.sys.refresh_memory();
        let free = bytes_to_size(self.sys.free_memory(), &self.target_unit);
        let total = bytes_to_size(self.sys.total_memory(), &self.target_unit);
        let used = bytes_to_size(self.sys.used_memory(), &self.target_unit);

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

fn current_time() -> i64 {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH);
    since_the_epoch.unwrap().as_millis() as i64
}

fn bytes_to_size(bytes: u64, dest_unit: &ByteUnit) -> f64 {
    let result = Byte::from_unit(bytes as f64, ByteUnit::B)
        .unwrap()
        .get_adjusted_unit(*dest_unit)
        .get_value();

    (result * 100.0).round() / 100.0 // round to 2 decimal places
}
