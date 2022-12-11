use rusqlite::{params, Connection, Result};

trait TimeSeries {
    fn store(&self, conn: &Connection) -> Result<()>;
    fn get_from(
        &self,
        conn: &Connection,
        from: Duration,
        to: Duration,
    ) -> Result<Vec<(Duration, f64)>>;
    fn get_all(&self, conn: &Connection) -> Result<Vec<(Duration, f64)>>;
}

