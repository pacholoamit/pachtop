extern crate systemstat;
use crate::models::Memory;

use std::time::{SystemTime, UNIX_EPOCH};
use systemstat::{Platform, System};

#[tauri::command]
pub fn get_memory() -> Result<Memory, String> {
    match Metrics::new().memory() {
        Ok(mem) => Ok(mem),
        Err(_) => Err("Error while getting memory info".to_string()),
    }
}

struct Metrics {
    sys: systemstat::platform::PlatformImpl,
}

impl Metrics {
    fn new() -> Self {
        Metrics { sys: System::new() }
    }

    fn memory(&self) -> Result<Memory, std::io::Error> {
        let mem = match self.sys.memory() {
            Ok(mem) => mem,
            Err(e) => return Err(e),
        };

        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Error getting system time");

        let mem = Memory {
            free: mem.free.as_u64(),
            total: mem.total.as_u64(),
            used: mem.total.as_u64() - mem.free.as_u64(),
            timestamp: timestamp.as_secs(),
        };

        Ok(mem)
    }
}
