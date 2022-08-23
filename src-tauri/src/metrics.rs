extern crate systemstat;
use crate::models::Memory;

use chrono::prelude::*;
use std::{
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};
use systemstat::{ByteSize, Platform, System};
use tauri::State;

#[tauri::command]
pub fn get_memory(state: State<'_, MetricsState>) -> Result<Memory, String> {
    match state.0.lock().unwrap().memory() {
        Ok(mem) => Ok(mem),
        Err(e) => Err(String::from("Memory error: ") + e.to_string().as_str()),
    }
}

pub struct MetricsState(Arc<Mutex<Metrics>>);

impl Default for MetricsState {
    fn default() -> Self {
        MetricsState(Arc::new(Mutex::new(Metrics { sys: System::new() })))
    }
}

struct Metrics {
    sys: systemstat::platform::PlatformImpl,
}

impl Metrics {
    fn memory(&self) -> Result<Memory, std::io::Error> {
        let mem = match self.sys.memory() {
            Ok(mem) => mem,
            Err(e) => return Err(e),
        };

        let total = bytes_to_mb(&mem.total);
        let free = bytes_to_mb(&mem.free);

        let mem = Memory {
            free,
            total,
            used: &total - &free,
            timestamp: get_timestamp(),
        };

        Ok(mem)
    }
}

fn get_timestamp() -> String {
    Local::now().time().to_string()
}

fn bytes_to_mb(bytes: &ByteSize) -> u64 {
    bytes.as_u64() / 1024 / 1024
}
