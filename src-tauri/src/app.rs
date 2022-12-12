use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

use rusqlite::params;
use sysinfo::{System, SystemExt};
use tauri::{Manager, State, Window};

use crate::metrics::Metrics;
use crate::models::*;
use crate::sqlite::Sqlite;

pub struct AppState(Arc<Mutex<App>>);

impl AppState {
    pub fn new() -> Self {
        AppState(Arc::new(Mutex::new(App::default())))
    }
}

pub struct App {
    pub metrics: Metrics,
    pub sqlite: Sqlite,
}

impl Default for App {
    fn default() -> Self {
        App {
            metrics: Metrics::default(),
            sqlite: Sqlite::new().expect("Failed to create sqlite connection"),
        }
    }
}

// #[tauri::command]
// pub fn get_sysinfo(state: State<'_, App>, window: Window) {
//     let mut metrics = state.metrics.lock().unwrap();
//     let info = metrics.sysinfo();
//     thread::spawn(move || loop {
//         window.emit("get_sysinfo", &info).unwrap();
//         thread::sleep(Duration::from_secs(1));
//     });
// }

#[tauri::command]
pub fn get_sysinfo(state: State<'_, AppState>) -> String {
    let mut state = state.0.lock().unwrap();
    let data = state.metrics.get_system_information();
    let table = "system_information";

    let create_table_sql = "
    CREATE TABLE IF NOT EXISTS system_information (
        id INTEGER PRIMARY KEY,
        kernel_version TEXT NOT NULL,
        os_version TEXT NOT NULL,
        hostname TEXT NOT NULL,
        core_count INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

    state
        .sqlite
        .conn
        .execute(create_table_sql, params![])
        .expect("Failed to create table");

    state.sqlite.conn.execute("
    INSERT INTO system_information (kernel_version, os_version, hostname, core_count) VALUES (?1,?2,?3,?4)",
    params![data.kernel_version, data.os_version, data.hostname, data.core_count])
    .expect("Failed to insert data");

    // loop {
    //     let data = state.metrics.get_system_information();
    //     state
    //         .sqlite
    //         .create_table_from_struct::<SysInfo>(&table.to_owned(), &data);
    //     state.sqlite.insert(table, &data);
    //     thread::sleep(Duration::from_secs(1));
    // }

    // state
    //     .0
    //     .lock()
    //     .unwrap()
    //     .sqlite
    //     .create_table_from_struct::<SysInfo>(table, &data)
    //     .insert(table, &data);

    "Hello_world".into()
}

#[tauri::command]
pub fn get_global_cpu(state: State<'_, AppState>) -> GlobalCpu {
    state.0.lock().unwrap().metrics.get_global_cpu()
}

#[tauri::command]
pub fn get_cpus(state: State<'_, AppState>) -> Vec<Cpu> {
    state.0.lock().unwrap().metrics.get_cpus()
}

#[tauri::command]
pub fn get_memory(state: State<'_, AppState>) -> Memory {
    state.0.lock().unwrap().metrics.get_memory()
}

#[tauri::command]
pub fn get_swap(state: State<'_, AppState>) -> Swap {
    state.0.lock().unwrap().metrics.get_swap()
}

#[tauri::command]
pub fn get_networks(state: State<'_, AppState>) -> Vec<Network> {
    state.0.lock().unwrap().metrics.get_networks()
}
#[tauri::command]
pub fn get_disks(state: State<'_, AppState>) -> Vec<Disk> {
    state.0.lock().unwrap().metrics.get_disks()
}

#[tauri::command]
pub fn get_processes(state: State<'_, AppState>) -> Vec<Process> {
    state.0.lock().unwrap().metrics.get_processes()
}

#[tauri::command]
pub fn kill_process(state: State<'_, AppState>, pid: String) -> bool {
    state.0.lock().unwrap().metrics.kill_process(pid)
}
