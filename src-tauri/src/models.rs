use byte_unit::ByteUnit;
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Memory {
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
    pub timestamp: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Swap {
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
    pub timestamp: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SysInfo {
    pub kernel_version: String,
    pub os_version: String,
    pub hostname: String,
    pub timestamp: i64,
}
