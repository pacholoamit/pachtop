use std::time::{SystemTime, UNIX_EPOCH};

use crate::models::Timestamp;

pub fn current_time() -> Timestamp {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH);
    Timestamp(since_the_epoch.unwrap().as_millis() as i64)
}

pub fn get_percentage(value: &u64, total: &u64) -> f64 {
    let percentage = (*value as f64 / *total as f64) * 100.0;
    (percentage * 100.0).round() / 100.0
}
