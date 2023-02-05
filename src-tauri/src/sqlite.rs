use std::error::Error;

use rusqlite::{Connection, Result};
use serde::{de::DeserializeOwned, Serialize};
use tauri::api::path::cache_dir;
pub trait TimeSeriesExt {
    fn init(&self);
    fn store<T: Serialize>(&self, data: T);
    fn query<T: DeserializeOwned>(&self) -> Result<Vec<T>, Box<dyn Error>>;
}
#[derive(Debug)]
pub struct Sqlite {
    pub conn: Connection,
}

impl Sqlite {
    pub fn new() -> Result<Sqlite, Box<dyn Error>> {
        let cache_dir = cache_dir().expect("Failed to get cache dir");
        let sqlite_path = cache_dir.join("metrics.db"); // TODO: include app name in folder

        println!("Created sqlite db at: {:?}", sqlite_path);
        let conn = Connection::open(sqlite_path)?; // TODO: make this configurable
        Ok(Sqlite { conn })
    }
}
