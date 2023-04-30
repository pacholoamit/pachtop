use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Timestamp(pub i64);

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Memory {
    pub free: u64,
    pub total: u64,
    pub used: u64,
    pub used_percentage: f64,
    pub timestamp: Timestamp,
}

pub trait MemoryTrait {
    fn get_memory(&mut self) -> Memory;
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlobalCpu {
    pub usage: f32,
    pub brand: String,
    pub frequency: u64,
    pub name: String,
    pub vendor: String,
    pub timestamp: Timestamp,
}

pub trait GlobalCpuTrait {
    fn get_global_cpu(&mut self) -> GlobalCpu;
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cpu {
    pub name: String,
    pub usage: f64,
    pub timestamp: Timestamp,
}

pub trait CpuTrait {
    fn get_cpus(&mut self) -> Vec<Cpu>;
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Swap {
    pub free: u64,
    pub total: u64,
    pub used: u64,
    pub used_percentage: f64,
    pub timestamp: Timestamp,
}

pub trait SwapTrait {
    fn get_swap(&mut self) -> Swap;
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SysInfo {
    pub kernel_version: String,
    pub os_version: String,
    pub hostname: String,
    pub core_count: String,
    pub timestamp: Timestamp,
}

pub trait SystemInformationTrait {
    fn get_system_information(&mut self) -> SysInfo;
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Network {
    pub name: String,
    pub received: u64,
    pub transmitted: u64,
    pub timestamp: Timestamp,
}

pub trait NetworkTrait {
    fn get_networks(&mut self) -> Vec<Network>;
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    pub name: String,
    pub free: u64,
    pub total: u64,
    pub used: u64,
    pub mount_point: PathBuf,
    pub file_system: String,
    pub disk_type: String,
    pub is_removable: bool,
    pub timestamp: Timestamp,
}

pub trait DisksTrait {
    fn get_disks(&mut self) -> Vec<Disk>;
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Process {
    pub name: String,
    pub pid: String,
    pub cpu_usage: f32,
    pub memory_usage: u64,
    pub status: String,
}

pub trait ProcessesTrait {
    fn get_processes(&mut self) -> Vec<Process>;
    fn kill_process(&mut self, pid: &str) -> bool;
}
