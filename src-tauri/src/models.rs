use std::ffi::{OsStr, OsString};

use byte_unit::ByteUnit;
use serde::{Deserialize, Serialize};
use sysinfo::DiskType;

#[derive(Debug, Serialize, Deserialize)]
pub struct Timestamp(pub i64);

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Memory {
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
    pub used_percentage: f64,
    pub timestamp: Timestamp,
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

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cpu {
    pub name: String,
    pub usage: f64,
    pub timestamp: Timestamp,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Swap {
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
    pub used_percentage: f64,
    pub timestamp: Timestamp,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SysInfo {
    pub kernel_version: String,
    pub os_version: String,
    pub hostname: String,
    pub core_count: String,
    pub disk_count: String,
    pub timestamp: Timestamp,
}
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Network {
    pub unit: ByteUnit,
    pub name: String,
    pub received: f64,
    pub transmitted: f64,
    pub timestamp: Timestamp,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    pub name: Box<OsString>,
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
    pub file_system: Vec<u8>,
    pub disk_type: String,
    pub is_removable: bool,
    pub timestamp: Timestamp,
}
