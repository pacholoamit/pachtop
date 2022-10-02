use crate::models::{Cpu, GlobalCpu, Memory, Network, Swap, SysInfo, Timestamp};
use byte_unit::{Byte, ByteUnit};
use std::{
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};
use sysinfo::{CpuExt, NetworkExt, System, SystemExt};

use tauri::State;

#[tauri::command]
pub fn get_sysinfo(state: State<'_, MetricsState>) -> SysInfo {
    state.0.lock().unwrap().sysinfo()
}

#[tauri::command]
pub fn get_global_cpu(state: State<'_, MetricsState>) -> GlobalCpu {
    state.0.lock().unwrap().global_cpu()
}

#[tauri::command]
pub fn get_cpus(state: State<'_, MetricsState>) -> Vec<Cpu> {
    state.0.lock().unwrap().cpus()
}

#[tauri::command]
pub fn get_memory(state: State<'_, MetricsState>) -> Memory {
    state.0.lock().unwrap().memory()
}

#[tauri::command]
pub fn get_swap(state: State<'_, MetricsState>) -> Swap {
    state.0.lock().unwrap().swap()
}

#[tauri::command]
pub fn get_networks(state: State<'_, MetricsState>) -> Vec<Network> {
    state.0.lock().unwrap().networks()
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

    fn global_cpu(&mut self) -> GlobalCpu {
        self.sys.refresh_cpu();

        let cpu = self.sys.global_cpu_info();
        let usage = cpu.cpu_usage();
        let brand = cpu.brand().to_owned();
        let frequency = cpu.frequency().to_owned();
        let name = cpu.name().to_owned();
        let vendor = cpu.vendor_id().to_owned();

        GlobalCpu {
            usage,
            brand,
            frequency,
            name,
            vendor,
            timestamp: current_time(),
        }
    }

    fn cpus(&mut self) -> Vec<Cpu> {
        let cpus: Vec<Cpu> = self
            .sys
            .cpus()
            .into_iter()
            .map(|cpu| {
                let name = cpu.name().to_owned();
                let usage = cpu.cpu_usage().to_owned() as u64;
                let total = 100;

                Cpu {
                    name,
                    usage: get_percentage(&usage, &total),
                    timestamp: current_time(),
                }
            })
            .collect();

        cpus
    }

    fn memory(&mut self) -> Memory {
        self.sys.refresh_memory();
        let free = bytes_to_size(&self.sys.free_memory(), &self.target_unit);
        let total = bytes_to_size(&self.sys.total_memory(), &self.target_unit);
        let used = bytes_to_size(&self.sys.used_memory(), &self.target_unit);

        Memory {
            free,
            total,
            used,
            used_percentage: get_percentage(&self.sys.used_memory(), &self.sys.total_memory()),
            unit: self.target_unit,
            timestamp: current_time(),
        }
    }

    fn swap(&mut self) -> Swap {
        self.sys.refresh_memory();
        let total = bytes_to_size(&self.sys.total_swap(), &self.target_unit);
        let used = bytes_to_size(&self.sys.used_swap(), &self.target_unit);
        let free = bytes_to_size(&self.sys.free_swap(), &self.target_unit);

        Swap {
            free,
            total,
            used,
            used_percentage: get_percentage(&self.sys.used_swap(), &self.sys.total_swap()),
            unit: self.target_unit,
            timestamp: current_time(),
        }
    }

    fn networks(&mut self) -> Vec<Network> {
        self.sys.refresh_networks();

        let networks: Vec<Network> = self
            .sys
            .networks()
            .into_iter()
            .map(|(name, network)| {
                let name = name.to_owned();
                let received = bytes_to_size(&network.received(), &ByteUnit::KB);
                let transmitted = bytes_to_size(&network.transmitted(), &ByteUnit::KB);

                Network {
                    name,
                    received,
                    transmitted,
                    unit: ByteUnit::KB,
                    timestamp: current_time(),
                }
            })
            .collect();

        networks
    }
}

fn current_time() -> Timestamp {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH);
    Timestamp(since_the_epoch.unwrap().as_millis() as i64)
}

fn get_percentage(value: &u64, total: &u64) -> f64 {
    let percentage = (*value as f64 / *total as f64) * 100.0;
    (percentage * 100.0).round() / 100.0
}

fn bytes_to_size(bytes: &u64, &dest_unit: &ByteUnit) -> f64 {
    let result = Byte::from_unit(*bytes as f64, ByteUnit::B)
        .unwrap()
        .get_adjusted_unit(dest_unit)
        .get_value();

    (result * 100.0).round() / 100.0 // round to 2 decimal places
}
