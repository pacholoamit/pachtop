use std::{
    path::PathBuf,
    sync::{atomic::AtomicU64, Arc, Mutex},
};

use crate::dirstat::DiskItem;
use crate::models::*;
use crate::{app::AppState, dirstat::FileInfo};

use serde::{Deserialize, Serialize};
use tauri::{Manager, State};

use log::info;
use tauri_plugin_shell::ShellExt;
use ts_rs::TS;

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
pub fn open(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let child = std::process::Command::new("open")
            .arg(path)
            .arg("-R")
            .spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(target_os = "linux")]
    {
        let child = std::process::Command::new("xdg-open").arg(path).spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(target_os = "windows")]
    {
        let child = std::process::Command::new("explorer").arg(path).spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
}

#[tauri::command]
pub fn show_in_terminal(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let child = std::process::Command::new("open")
            .arg("-a")
            .arg("Terminal")
            .arg(path)
            .spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(target_os = "linux")]
    {
        let child = std::process::Command::new("gnome-terminal")
            .arg("--")
            .arg("bash")
            .arg("-c")
            .arg(format!("cd {}; exec bash", path))
            .spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(target_os = "windows")]
    {
        let child = std::process::Command::new("cmd")
            .arg("/c")
            .arg(format!("start cmd /k cd /d {}", path))
            .spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
}

#[tauri::command]
pub fn delete_folder(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let child = std::process::Command::new("rm")
            .arg("-rf")
            .arg(&path)
            .spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(target_os = "linux")]
    {
        let child = std::process::Command::new("rm")
            .arg("-rf")
            .arg(&path)
            .spawn()
            .unwrap();
    }
    #[cfg(target_os = "windows")]
    {
        let child = std::process::Command::new("cmd")
            .arg("/C")
            .arg("rmdir")
            .arg("/S")
            .arg("/Q")
            .arg(&path)
            .spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
}

#[tauri::command]
pub fn delete_file(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let child = std::process::Command::new("rm").arg(&path).spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(target_os = "linux")]
    {
        let child = std::process::Command::new("rm").arg(&path).spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
    #[cfg(target_os = "windows")]
    {
        let child = std::process::Command::new("cmd")
            .arg("/C")
            .arg("del")
            .arg(&path)
            .spawn();

        match child {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
}

#[tauri::command]
pub fn add_pachtop_exclusion(window: tauri::Window) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let shell = window.app_handle().shell();

        let output = tauri::async_runtime::block_on(async move {
            shell.command("powershell").arg("-Command").args(["Start-Process powershell -ArgumentList '-Command \"Add-MpPreference -ExclusionProcess \\\"pachtop.exe\\\"\"' -Verb RunAs -WindowStyle Hidden"]).output().await.unwrap()
        });
        if !output.status.success() {
            return Err("Failed to add Pachtop to Exclusion list".into());
        }

        Ok(())
    }

    #[cfg(target_os = "macos")]
    {
        Ok(())
    }

    #[cfg(target_os = "linux")]
    {
        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct DiskScanInput {
    pub path: String,
    pub is_turbo: bool,
    pub disk_name: String,
}

#[tauri::command]
pub async fn disk_scan(
    input: DiskScanInput,
    window: tauri::Window,
    state: tauri::State<'_, AppState>,
) -> Result<DiskItem, String> {
    let DiskScanInput {
        disk_name,
        is_turbo,
        path,
    } = input;

    info!(
        "Disk analysis started on {}: path = {}, turbo = {}",
        disk_name, path, is_turbo
    );

    let bytes_scanned = Arc::new(AtomicU64::new(0));
    let time = std::time::Instant::now();

    let path_buf = PathBuf::from(&path);
    let total_bytes = state.0.lock().unwrap().metrics.find_disk(&path).total;
    let file_info = FileInfo::from_path(&path_buf, true).map_err(|e| e.to_string())?;
    let last_emit_time = Arc::new(Mutex::new(std::time::Instant::now()));

    let emitter = window.clone();
    let callback = move |scanned: u64, total: u64| {
        let mut last_emit = last_emit_time.lock().unwrap();
        // Emit progress every 100ms to not overwhelm the UI
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
            &is_turbo,
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

    info!(
        "Scanning completed in {} for {} , turbo: {}",
        time.elapsed().as_secs_f32(),
        &disk_name,
        is_turbo
    );

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
