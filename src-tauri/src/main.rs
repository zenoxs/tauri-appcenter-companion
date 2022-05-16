#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
mod window_ext;

use tauri::Manager;
use tauri_plugin_store::PluginBuilder;
use tauri_plugin_websocket::TauriWebsocket;
 #[cfg(target_os = "macos")]
use window_ext::WindowExt;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

fn main() {
    tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .plugin(TauriWebsocket::default())
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "macos")]
            window.set_transparent_titlebar(true);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // let window = app.get_window("main");
    //
    // #[cfg(target_os = "macos")]
    // apply_vibrancy(window, NSVisualEffectMaterial::HudWindow);
}
