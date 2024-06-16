use log::info;

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::AtomicU64;
use std::sync::{Arc, Mutex};

use tauri::State;

use crate::dirstat::{DiskItem, FileInfo};
use crate::metrics::Metrics;
use crate::models::*;
use tauri::Manager;

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
    pub fn emit_sysinfo(&self, app: &tauri::AppHandle) {
        let sys_info = self.0.lock().unwrap().metrics.get_system_information();
        app.emit("emit_sysinfo", &sys_info).unwrap();
    }

    pub fn emit_global_cpu(&self, app: &tauri::AppHandle) {
        let global_cpu = self.0.lock().unwrap().metrics.get_global_cpu();
        app.emit("emit_global_cpu", &global_cpu).unwrap();
    }

    pub fn emit_cpus(&self, app: &tauri::AppHandle) {
        let cpus = self.0.lock().unwrap().metrics.get_cpus();
        app.emit("emit_cpus", &cpus).unwrap();
    }

    pub fn emit_memory(&self, app: &tauri::AppHandle) {
        let memory = self.0.lock().unwrap().metrics.get_memory();
        app.emit("emit_memory", &memory).unwrap();
    }

    pub fn emit_swap(&self, app: &tauri::AppHandle) {
        let swap = self.0.lock().unwrap().metrics.get_swap();
        app.emit("emit_swap", &swap).unwrap();
    }

    pub fn emit_networks(&self, app: &tauri::AppHandle) {
        let networks = self.0.lock().unwrap().metrics.get_networks();
        app.emit("emit_networks", &networks).unwrap();
    }

    pub fn emit_disks(&self, app: &tauri::AppHandle) {
        let disks = self.0.lock().unwrap().metrics.get_disks();
        app.emit("emit_disks", &disks).unwrap();
    }

    pub fn emit_processes(&self, app: &tauri::AppHandle) {
        let processes = self.0.lock().unwrap().metrics.get_processes();
        app.emit("emit_processes", &processes).unwrap();
    }
}

#[tauri::command]
pub fn kill_process(state: State<'_, AppState>, name: String) -> bool {
    let killed = state.0.lock().unwrap().metrics.kill_process(&name);

    info!(
        "Running kill_process command, name: {}, killed: {}",
        &name, killed
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

// TODO: add separation
pub fn add_pachtop_exclusion() {
    #[cfg(target_os = "windows")]
    use std::process::Command;

    // Check if the script is running as administrator
    let output = Command::new("powershell")
            .arg("-Command")
            .arg("([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)")
            .output()
            .expect("Failed to check admin privileges");

    if output.status.success() && String::from_utf8_lossy(&output.stdout).trim() == "True" {
        // If running as administrator, run the PowerShell command
        Command::new("powershell")
            .arg("-Command")
            .arg("Add-MpPreference -ExclusionProcess \"pachtop.exe\"")
            .spawn()
            .expect("Failed to add exclusion process");
    } else {
        // If not running as administrator, run the command with elevated privileges without creating a command prompt window
        Command::new("powershell")
                .arg("-Command")
                .arg("Start-Process powershell -ArgumentList '-Command \"Add-MpPreference -ExclusionProcess \\\"pachtop.exe\\\"\"' -Verb RunAs -WindowStyle Hidden")
                .spawn()
                .expect("Failed to run as administrator");
    }
}

#[tauri::command]
// Slow version
pub async fn disk_scan(
    window: tauri::Window,
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<DiskItem, String> {
    dbg!("Disk analysis on:", &path);
    let bytes_scanned = Arc::new(AtomicU64::new(0));
    let time = std::time::Instant::now();

    let path_buf = PathBuf::from(&path);
    let total_bytes = state.0.lock().unwrap().metrics.find_disk(&path).total;
    let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;
    let last_emit_time = Arc::new(Mutex::new(std::time::Instant::now()));

    let emitter = window.clone();
    let callback = move |scanned: u64, total: u64| {
        let mut last_emit = last_emit_time.lock().unwrap();
        // Emit progress every 200ms to not overwhelm the UI
        if last_emit.elapsed() >= std::time::Duration::from_millis(100) {
            let progress = DiskAnalysisProgress { scanned, total };
            match emitter.emit("disk_analysis_progress", &progress) {
                Ok(_) => {}
                Err(e) => {
                    dbg!("Error emitting disk_analysis_progress", e);
                }
            }
            *last_emit = std::time::Instant::now();
        }
    };

    let analysed = match file_info {
        FileInfo::Directory { volume_id } => DiskItem::scan(
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

    let complete = DiskAnalysisProgress {
        scanned: total_bytes,
        total: total_bytes,
    };

    // Emit final progress to close the progress
    window
        .emit("disk_analysis_progress", complete)
        .map_err(|e| e.to_string())?;

    state.set_disk_analysis(path, analysed.clone());

    dbg!("Total bytes:", total_bytes);
    dbg!("Scanning complete:", time.elapsed().as_secs_f32());

    Ok(analysed)
}

#[tauri::command]
// Multithreaded fast version, uses high cpu/memory
pub async fn disk_turbo_scan(
    window: tauri::Window,
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<DiskItem, String> {
    #[cfg(target_os = "windows")]
    {
        add_pachtop_exclusion();
    }
    dbg!("Turbo Disk analysis on:", &path);
    let bytes_scanned = Arc::new(AtomicU64::new(0));
    let time = std::time::Instant::now();

    let path_buf = PathBuf::from(&path);
    let total_bytes = state.0.lock().unwrap().metrics.find_disk(&path).total;
    let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;
    let last_emit_time = Arc::new(Mutex::new(std::time::Instant::now()));

    let emitter = window.clone();
    let callback = move |scanned: u64, total: u64| {
        let mut last_emit = last_emit_time.lock().unwrap();
        // Emit progress every 200ms to not overwhelm the UI
        if last_emit.elapsed() >= std::time::Duration::from_millis(200) {
            let progress = DiskAnalysisProgress { scanned, total };
            match emitter.emit("disk_analysis_progress", &progress) {
                Ok(_) => {}
                Err(e) => {
                    dbg!("Error emitting disk_analysis_progress", e);
                }
            }
            *last_emit = std::time::Instant::now();
        }
    };

    let analysed = match file_info {
        FileInfo::Directory { volume_id } => DiskItem::turbo_scan(
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

    let complete = DiskAnalysisProgress {
        scanned: total_bytes,
        total: total_bytes,
    };

    // Emit final progress to close the progress
    window
        .emit("disk_analysis_progress", complete)
        .map_err(|e| e.to_string())?;

    state.set_disk_analysis(path, analysed.clone());

    dbg!("Total bytes:", total_bytes);
    dbg!("Scanning complete:", time.elapsed().as_secs_f32());

    Ok(analysed)
}

#[tauri::command]
// Get data from hashmap
pub async fn disk_analysis_flattened(
    state: tauri::State<'_, AppState>,
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
