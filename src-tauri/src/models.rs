use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Memory {
    pub free: u64,
    pub total: u64,
    pub used: u64,
    pub timestamp: String,
}
