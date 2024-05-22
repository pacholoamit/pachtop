use log::info;

use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{State, Window};

use crate::dirstat::{DiskItem, FileInfo};
use crate::metrics::Metrics;
use crate::{models::*, win};

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

#[tauri::command]
pub fn deep_scan_emit(window: tauri::Window, path: String) -> Result<(), String> {
    let time = std::time::Instant::now();
    dbg!("Scanning folder:", &path);
    let path_buf = PathBuf::from(&path);

    let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;

    let callback: Arc<dyn Fn(&DiskItem) + Send + Sync> = Arc::new(move |item: &DiskItem| {
        if let Err(e) = window.emit("deep_scan_analysis", item) {
            eprintln!("Failed to send signal: {}", e);
        }
    });

    thread::spawn(move || {
        let analysed = match file_info {
            FileInfo::Directory { volume_id } => {
                DiskItem::from_analyze_callback(&path_buf, true, volume_id, Arc::clone(&callback))
                    .map_err(|e| e.to_string())
            }
            _ => Err("Not a directory".into()),
        };

        match analysed {
            Ok(_) => {
                dbg!("Scanning complete");
                dbg!("Time taken:", time.elapsed().as_secs_f32());
            }
            Err(err) => {
                eprintln!("Error during analysis: {}", err);
            }
        }
    });

    Ok(())
}

#[tauri::command]
pub async fn deep_scan(path: String) -> Result<DiskItem, String> {
    let time = std::time::Instant::now();
    dbg!("Scanning folder:", &path);
    let path_buf = PathBuf::from(&path);
    let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;

    let analysed = match file_info {
        FileInfo::Directory { volume_id } => {
            DiskItem::from_analyze(&path_buf, true, volume_id).map_err(|e| e.to_string())?
        }
        _ => return Err("Not a directory".into()),
    };

    dbg!("Scanning complete");
    dbg!("Time taken:", time.elapsed().as_secs_f32());

    Ok(analysed)
}

// #[tauri::command]  355.9603 seconds
// pub async fn deep_scan(path: String) -> Result<Vec<DiskItem>, String> {
//     let time = std::time::Instant::now();
//     dbg!("Scanning folder:", &path);
//     let path_buf = PathBuf::from(&path);
//     let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;

//     let analysed = match file_info {
//         FileInfo::Directory { volume_id } => {
//             let sub_entries = fs::read_dir(path_buf)
//                 .map_err(|e| e.to_string())?
//                 .filter_map(Result::ok)
//                 .collect::<Vec<_>>();

//             let mut sub_items = sub_entries
//                 .par_iter() // Use rayon's parallel iterator
//                 .filter_map(|entry| DiskItem::from_analyze(&entry.path(), true, volume_id).ok())
//                 .collect::<Vec<_>>();

//             sub_items.sort_unstable_by(|a, b| a.metadata.size.cmp(&b.metadata.size).reverse());

//             sub_items
//         }
//         FileInfo::File { size, .. } => vec![DiskItem {
//             name: path_buf
//                 .file_name()
//                 .unwrap_or(OsStr::new("."))
//                 .to_string_lossy()
//                 .to_string(),
//             metadata: DiskItemMetadata { size },
//             children: None,
//         }],
//     };

//     dbg!("Scanning complete");
//     dbg!("Time taken:", time.elapsed().as_secs_f32());
//     Ok(analysed)
// }
