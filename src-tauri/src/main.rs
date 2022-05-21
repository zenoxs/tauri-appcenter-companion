#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
mod window_ext;

use tauri::Manager;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use tauri_plugin_store::PluginBuilder;
use tauri_plugin_websocket::TauriWebsocket;

#[cfg(target_os = "macos")]
use window_ext::WindowExt;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[cfg(target_os = "windows")]
use window_vibrancy::apply_mica;

#[tauri::command]
async fn frontend_ready(window: tauri::Window) {
    window.get_window("main").unwrap().show().unwrap();
}

fn main() {
    let ctx = tauri::generate_context!();
    let menu = if cfg!(not(target_os = "windows")) {
        Menu::new()
            .add_submenu(Submenu::new(
                &ctx.package_info().name,
                Menu::new()
                    .add_native_item(MenuItem::Hide)
                    .add_native_item(MenuItem::HideOthers)
                    .add_native_item(MenuItem::ShowAll)
                    .add_native_item(MenuItem::Separator)
                    .add_native_item(MenuItem::Quit),
            ))
            .add_submenu(Submenu::new(
                "Edit",
                Menu::new()
                    .add_native_item(MenuItem::Undo)
                    .add_native_item(MenuItem::Redo)
                    .add_native_item(MenuItem::Separator)
                    .add_native_item(MenuItem::Cut)
                    .add_native_item(MenuItem::Copy)
                    .add_native_item(MenuItem::Paste)
                    .add_native_item(MenuItem::SelectAll),
            ))
            .add_submenu(Submenu::new(
                "View",
                Menu::new().add_native_item(MenuItem::EnterFullScreen),
            ))
            .add_submenu(Submenu::new(
                "Window",
                Menu::new()
                    .add_native_item(MenuItem::Minimize)
                    .add_native_item(MenuItem::Zoom),
            ))
            .add_submenu(Submenu::new(
                "Help",
                Menu::new().add_item(CustomMenuItem::new("Learn More", "Learn More")),
            ))
    } else {
        Menu::new()
    };

    tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .plugin(TauriWebsocket::default())
        .menu(menu)
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window)
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            #[cfg(target_os = "macos")]
            window.set_transparent_titlebar(true);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![frontend_ready])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
