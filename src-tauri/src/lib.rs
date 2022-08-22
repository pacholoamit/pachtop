pub mod models;

extern crate systemstat;
use models::Memory;
use std::time::Duration;
use std::time::{SystemTime, UNIX_EPOCH};
use systemstat::{
    BTreeMap, CPULoad, DelayedMeasurement, Filesystem, Network, Platform, Swap, System,
};

pub struct Metrics {
    pub sys: systemstat::platform::PlatformImpl,
}

impl Metrics {
    pub fn new() -> Self {
        Metrics { sys: System::new() }
    }

    pub fn memory(&self) -> Result<Memory, std::io::Error> {
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
