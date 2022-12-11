use std::time::Duration;

use rusqlite::{params, Connection, Result};

trait TimeSeries<T> {
    fn store(&self, conn: &Connection) -> Result<T>;
    fn get_from(&self, conn: &Connection, from: Duration, to: Duration) -> Result<Vec<T>>;
    fn get_all(&self, conn: &Connection) -> Result<Vec<T>>;
}
