use log::info;

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::AtomicU64;
use std::sync::{Arc, Mutex};

use tauri::{State, Window};

use crate::dirstat::{DiskItem, FileInfo};
use crate::metrics::Metrics;
use crate::models::*;

pub struct AppState(Arc<Mutex<App>>);

impl AppState {
    pub fn new() -> Self {
        AppState(Arc::new(Mutex::new(App::default())))
    }
}

#[derive(Default)]
pub struct DiskStore {
    analysis: HashMap<String, DiskItem>,
}

#[derive(Default)]
pub struct AppStore {
    pub disk: DiskStore,
}

#[derive(Default)]
pub struct App {
    pub metrics: Metrics,
    pub store: AppStore,
}

impl AppState {
    pub fn set_disk_analysis(&self, name: String, disk_analysis: DiskItem) {
        self.0
            .lock()
            .unwrap()
            .store
            .disk
            .analysis
            .insert(name, disk_analysis);
    }
    pub fn emit_sysinfo(&self, window: &Window) {
        let sys_info = self.0.lock().unwrap().metrics.get_system_information();
        window.emit("emit_sysinfo", &sys_info).unwrap();
    }

    pub fn emit_global_cpu(&self, window: &Window) {
        let global_cpu = self.0.lock().unwrap().metrics.get_global_cpu();
        window.emit("emit_global_cpu", &global_cpu).unwrap();
    }

    pub fn emit_cpus(&self, window: &Window) {
        let cpus = self.0.lock().unwrap().metrics.get_cpus();
        window.emit("emit_cpus", &cpus).unwrap();
    }

    pub fn emit_memory(&self, window: &Window) {
        let memory = self.0.lock().unwrap().metrics.get_memory();
        window.emit("emit_memory", &memory).unwrap();
    }

    pub fn emit_swap(&self, window: &Window) {
        let swap = self.0.lock().unwrap().metrics.get_swap();
        window.emit("emit_swap", &swap).unwrap();
    }

    pub fn emit_networks(&self, window: &Window) {
        let networks = self.0.lock().unwrap().metrics.get_networks();
        window.emit("emit_networks", &networks).unwrap();
    }

    pub fn emit_disks(&self, window: &Window) {
        let disks = self.0.lock().unwrap().metrics.get_disks();
        window.emit("emit_disks", &disks).unwrap();
    }

    pub fn emit_processes(&self, window: &Window) {
        let processes = self.0.lock().unwrap().metrics.get_processes();
        window.emit("emit_processes", &processes).unwrap();
    }
}

#[tauri::command]
pub fn kill_process(state: State<'_, AppState>, pid: String) -> bool {
    let killed = state.0.lock().unwrap().metrics.kill_process(&pid);

    info!(
        "Running kill_process command, pid: {}, killed: {}",
        &pid, killed
    );
    killed
}

#[tauri::command]
pub fn show_folder(path: String) {
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(path)
            .arg("-R")
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(path)
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(path)
            .spawn()
            .unwrap();
    }
}

#[tauri::command]
pub fn delete_folder(path: String) {
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("rm")
            .arg("-rf")
            .arg(path)
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("rm")
            .arg("-rf")
            .arg(path)
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("del")
            .arg("/f")
            .arg("/q")
            .arg(path)
            .spawn()
            .unwrap();
    }
}

#[tauri::command]
// Multithreaded fast version, uses high cpu/memory
pub fn disk_analysis(state: tauri::State<AppState>, path: String) -> Result<DiskItem, String> {
    let bytes_scanned = Arc::new(AtomicU64::new(0));
    let time = std::time::Instant::now();
    dbg!("Scanning folder:", &path);
    dbg!("Triggering Disk Analysis");

    let path_buf = PathBuf::from(&path);
    let total_bytes = state.0.lock().unwrap().metrics.find_disk(&path).total;

    let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;

    let callback = |scanned: u64, total: u64| {
        println!("Scanned {} out of {} bytes", scanned, total);
    };

    let analysed = match file_info {
        FileInfo::Directory { volume_id } => DiskItem::from_analyze(
            &path_buf,
            true,
            volume_id,
            &callback,
            total_bytes,
            Arc::clone(&bytes_scanned),
        )
        .map_err(|e| e.to_string())?,
        _ => return Err("Not a directory".into()),
    };

    state.set_disk_analysis(path, analysed.clone());

    dbg!("Total bytes:", total_bytes);

    dbg!(
        "Scanning complete Time taken:",
        time.elapsed().as_secs_f32()
    );

    Ok(analysed)
}

#[tauri::command]
// Multithreaded fast version, uses high cpu/memory
pub async fn disk_analysis_flattened<'a>(
    state: tauri::State<'a, AppState>,
    path: String,
) -> Result<Vec<DiskItem>, String> {
    let time = std::time::Instant::now();
    dbg!("Starting Disk Analysis flattened", time);
    let analysis_map = &state
        .0
        .lock()
        .map_err(|e| e.to_string())?
        .store
        .disk
        .analysis;

    let analysis = analysis_map.get(&path).cloned();

    match analysis {
        Some(analysis) => {
            dbg!("Analysis found");
            dbg!("Time taken:", time.elapsed().as_secs_f32());
            Ok(analysis.flatten(500))
        }
        None => {
            dbg!("Analysis not found");
            Err("Analysis not found".into())
        }
    }
}
