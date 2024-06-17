use anyhow::Ok;
use tauri::{App, Manager};
use tauri_plugin_autostart::MacosLauncher;

pub fn setup_plugins(app: &mut App) -> anyhow::Result<()> {
    let fs_plugin = tauri_plugin_fs::init();

    let store_plugin = tauri_plugin_store::Builder::default().build();

    let auto_start_plugin =
        tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--silently"]));

    let window_state_plugin = tauri_plugin_window_state::Builder::default().build();

    let process_plugin = tauri_plugin_process::init();

    let os_plugin = tauri_plugin_os::init();
    let single_instance_plugin = tauri_plugin_single_instance::init(|app, _argv, _cwd| {
        let window = app.get_webview_window("main").unwrap();
        if window.is_visible().unwrap() {
            window.set_focus().unwrap();
        } else {
            window.show().unwrap();
        }
    });

    let updater_plugin = tauri_plugin_updater::Builder::new();

    let handle = app.handle();

    handle.plugin(fs_plugin)?;
    handle.plugin(store_plugin)?;
    handle.plugin(auto_start_plugin)?;
    handle.plugin(window_state_plugin)?;
    handle.plugin(single_instance_plugin)?;
    handle.plugin(os_plugin)?;
    handle.plugin(updater_plugin.build())?;
    handle.plugin(process_plugin)?;

    Ok(())
}
