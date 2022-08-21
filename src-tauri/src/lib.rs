extern crate systemstat;
use std::time::Duration;
use systemstat::*;

pub struct Metrics {
    pub sys: systemstat::platform::PlatformImpl,
}

impl Metrics {
    pub fn new() -> Self {
        Metrics { sys: System::new() }
    }

    pub fn memory(&self) -> Memory {
        match self.sys.memory() {
            Ok(mem) => mem,
            Err(e) => panic!("\nMemory error: {}", e),
        }
    }

    pub fn mounts(&self) -> Vec<Filesystem> {
        match self.sys.mounts() {
            Ok(mounts) => mounts,
            Err(e) => panic!("\nMounts error: {}", e),
        }
    }

    pub fn networks(&self) -> BTreeMap<String, Network> {
        match self.sys.networks() {
            Ok(networks) => networks,
            Err(e) => panic!("\nNetworks error: {}", e),
        }
    }

    pub fn uptime(&self) -> Duration {
        match self.sys.uptime() {
            Ok(uptime) => uptime,
            Err(e) => panic!("\nUptime error: {}", e),
        }
    }

    pub fn swap(&self) -> Swap {
        match self.sys.swap() {
            Ok(swap) => swap,
            Err(e) => panic!("\nSwap error: {}", e),
        }
    }

    pub fn cpu_load_aggregate(&self) -> DelayedMeasurement<CPULoad> {
        match self.sys.cpu_load_aggregate() {
            Ok(cpu_load_aggregate) => cpu_load_aggregate,
            Err(e) => panic!("\nCPU load aggregate error: {}", e),
        }
    }
}
