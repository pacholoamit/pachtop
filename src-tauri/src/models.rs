use byte_unit::ByteUnit;
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Memory {
    pub free: ByteUnitValue,
    pub total: ByteUnitValue,
    pub used: ByteUnitValue,
    pub timestamp: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ByteUnitValue {
    pub value: f64,
    pub unit: ByteUnit,
}
