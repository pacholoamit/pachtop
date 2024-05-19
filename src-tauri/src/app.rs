use log::info;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use std::ffi::OsStr;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::{State, Window};

use crate::dirstat::{DiskItem, DiskItemMetadata, FileInfo};
use crate::metrics::Metrics;
use crate::models::*;

pub struct AppState(Arc<Mutex<App>>);

impl AppState {
    pub fn new() -> Self {
        AppState(Arc::new(Mutex::new(App::default())))
    }
}

#[derive(Default)]
pub struct App {
    pub metrics: Metrics,
}

impl AppState {
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

// Result<Vec<FileEntry>, String>
#[tauri::command]
pub async fn deep_scan(path: String) -> Result<Vec<DiskItem>, String> {
    dbg!("Scanning folder:", &path);
    let path_buf = PathBuf::from(&path);
    let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;

    let analysed = match file_info {
        FileInfo::Directory { volume_id } => {
            let sub_entries = fs::read_dir(path_buf)
                .map_err(|e| e.to_string())?
                .filter_map(Result::ok)
                .collect::<Vec<_>>();

            let mut sub_items = sub_entries
                .par_iter()
                .filter_map(|entry| DiskItem::from_analyze(&entry.path(), true, volume_id).ok())
                .collect::<Vec<_>>();

            sub_items.sort_unstable_by(|a, b| a.size.cmp(&b.size).reverse());

            sub_items
        }
        FileInfo::File { size, .. } => vec![DiskItem {
            name: path_buf
                .file_name()
                .unwrap_or(OsStr::new("."))
                .to_string_lossy()
                .to_string(),
            size,
            metadata: DiskItemMetadata { size },
            children: None,
        }],
    };

    dbg!("Scanning complete");

    Ok(analysed)
}
