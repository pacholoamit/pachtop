use std::error::Error;

use rusqlite::{params, Connection, Result};
use serde::{de::DeserializeOwned, Serialize};
use tauri::api::path::cache_dir;
trait TimeSeries {
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
        let sqlite_path = cache_dir.join("metrics.db");

        println!("Created sqlite db at: {:?}", sqlite_path);
        let conn = Connection::open(sqlite_path)?; // TODO: make this configurable
        Ok(Sqlite { conn })
    }

    pub fn create_table_from_struct<T>(&mut self, table_name: &String, obj: &T) -> &mut Self
    where
        T: Serialize,
    {
        let fields: Vec<String> = serde_json::to_vec(obj)
            .unwrap()
            .into_iter()
            .map(|f| f.to_string())
            .collect();

        println!("fields: {:?}", fields);
        let create_table_query = format!("CREATE TABLE {} ({})", table_name, fields.join(", "));

        self.conn
            .execute(&create_table_query, params![])
            .expect("Failed to create table");

        self
    }

    pub fn insert<T>(&mut self, table_name: &str, obj: &T) -> &mut Self
    where
        T: Serialize,
    {
        let fields: Vec<String> = serde_json::to_vec(obj)
            .unwrap()
            .into_iter()
            .map(|f| f.to_string())
            .collect();

        let insert_query = format!(
            "INSERT INTO {} ({}) VALUES ({})",
            table_name,
            fields.join(", "),
            fields.iter().map(|_| "?").collect::<Vec<&str>>().join(", ")
        );

        self.conn
            .execute(&insert_query, params![])
            .expect("Failed to insert data");

        self
    }
}
