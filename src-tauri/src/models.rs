use byte_unit::ByteUnit;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Timestamp(pub i64);

#[derive(Debug, Serialize, Deserialize)]
pub struct Memory {
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
    pub timestamp: Timestamp,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlobalCpu {
    pub cpu_usage: f32,
    pub cpu_brand: String,
    pub cpu_frequency: u64,
    pub cpu_name: String,
    pub cpu_vendor: String,
    pub timestamp: Timestamp,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Swap {
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
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
pub struct Network {
    pub unit: ByteUnit,
    pub name: String,
    pub received: f64,
    pub transmitted: f64,
    pub timestamp: Timestamp,
}
