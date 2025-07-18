use tauri::{Window, Emitter};
use reqwest::Client;
use tauri_plugin_oauth::{OauthConfig, start_with_config};
use url::Url;

// OAuth helper function to verify callback URL
fn verify(url: &str, expected_state: &str) -> Option<String> {
    let url = Url::parse(url).ok()?;
    if url.path() != "/callback" { return None; }

    let mut code = None;
    let mut ok = false;
    for (k, v) in url.query_pairs() {
        match &*k {
            "code" => code = Some(v.into_owned()),
            "state" => ok = v == expected_state,
            _ => {}
        }
    }
    code.filter(|_| ok)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn start_oauth(window: Window, state: String) -> Result<u16, String> {
    let cfg = OauthConfig {
        ports: Some(vec![8000, 8001, 8002]), // Multiple ports to avoid conflicts
        response: Some("OAuth finished. You may close this tab.".into()),
    };

    start_with_config(cfg, move |url| {
        if let Some(code) = verify(&url, &state) {
            let _ = window.emit("google_code", code);
        }
    }).map_err(|e| e.to_string())
}

#[tauri::command]
async fn exchange_code(
    code: String,
    client_id: String,
    client_secret: String,
    redirect_uri: String,
) -> Result<String, String> {
    let resp = Client::new()
        .post("https://oauth2.googleapis.com/token")
        .header("Accept", "application/json")
        .form(&[
            ("client_id", client_id),
            ("client_secret", client_secret),
            ("code", code),
            ("grant_type", "authorization_code".to_string()),
            ("redirect_uri", redirect_uri), // Google requires this
        ])
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;

    resp["access_token"]
        .as_str()
        .map(String::from)
        .ok_or("no token".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet, start_oauth, exchange_code])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
