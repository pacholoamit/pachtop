use crate::models::{Memory, Swap, SysInfo, Timestamp};
use byte_unit::{Byte, ByteUnit};
use std::{
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};
use sysinfo::{Cpu, CpuExt, System, SystemExt};
use tauri::State;

#[tauri::command]
pub fn get_sysinfo(state: State<'_, MetricsState>) -> SysInfo {
    state.0.lock().unwrap().sysinfo()
}

#[tauri::command]
pub fn get_global_cpu(state: State<'_, MetricsState>) {
    let cpus = state.0.lock().unwrap().cpu();
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

        let kernel_version = self.sys.kernel_version().unwrap();
        let os_version = self.sys.long_os_version().unwrap();
        let hostname = self.sys.host_name().unwrap();
        let core_count = self.sys.physical_core_count().unwrap().to_string();
        let disk_count = self.sys.disks().len().to_string();

        SysInfo {
            kernel_version,
            os_version,
            hostname,
            core_count,
            disk_count,
            timestamp: current_time(),
        }
    }

    fn global_cpu(&mut self) {
        self.sys.refresh_cpu();

        let cpu = self.sys.global_cpu_info();
        let cpu_usage = cpu.cpu_usage();
        let cpu_brand = cpu.brand();
        let cpu_frequency = cpu.frequency();
        let cpu_name = cpu.name();
        let cpu_vendor = cpu.vendor_id();

        self.sys.global_cpu_info().cpu_usage();
    }
    fn memory(&mut self) -> Memory {
        self.sys.refresh_memory();
        self.sys.refresh_cpu();
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

fn current_time() -> Timestamp {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH);
    Timestamp(since_the_epoch.unwrap().as_secs() as i64)
}

fn bytes_to_size(bytes: u64, dest_unit: &ByteUnit) -> f64 {
    let result = Byte::from_unit(bytes as f64, ByteUnit::B)
        .unwrap()
        .get_adjusted_unit(*dest_unit)
        .get_value();

    (result * 100.0).round() / 100.0 // round to 2 decimal places
}
