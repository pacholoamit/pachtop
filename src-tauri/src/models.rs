use byte_unit::ByteUnit;
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Memory {
    pub unit: ByteUnit,
    pub free: f64,
    pub total: f64,
    pub used: f64,
    pub timestamp: String,
}
