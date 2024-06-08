use serde::{Deserialize, Serialize};
use surrealdb::engine::local::SpeeDb;
use surrealdb::sql::Thing;
use surrealdb::Surreal;
use tauri::Config;

#[derive(Debug, Serialize)]
struct Name<'a> {
    first: &'a str,
    last: &'a str,
}

#[derive(Debug, Serialize)]
struct Person<'a> {
    title: &'a str,
    name: Name<'a>,
    marketing: bool,
}

#[derive(Debug, Serialize)]
struct Responsibility {
    marketing: bool,
}

#[derive(Debug, Deserialize)]
struct Record {
    #[allow(dead_code)]
    id: Thing,
}

pub async fn init() -> surrealdb::Result<()> {
    #[allow(non_upper_case_globals)]
    const contents: &str = include_str!("../../tauri.conf.json");
    let config: Config = serde_json::from_str(contents).unwrap();

    let app_dir = tauri::api::path::app_data_dir(&config).unwrap();

    let mut data_dir = app_dir.clone();
    data_dir.push("./data");
    // Create database connection
    let db = Surreal::new::<SpeeDb>(data_dir.to_str().unwrap()).await?;

    // Select a specific namespace / database
    db.use_ns("test").use_db("test").await?;

    // Create a new person with a random id
    let created: Vec<Record> = db
        .create("person")
        .content(Person {
            title: "Founder & CEO",
            name: Name {
                first: "Tobie",
                last: "Morgan Hitchcock",
            },
            marketing: true,
        })
        .await?;
    dbg!(created);

    // Update a person record with a specific id
    let updated: Option<Record> = db
        .update(("person", "jaime"))
        .merge(Responsibility { marketing: true })
        .await?;
    dbg!(updated);

    // Select all people records
    let people: Vec<Record> = db.select("person").await?;
    dbg!(people);

    // Perform a custom advanced query
    let groups = db
        .query("SELECT marketing, count() FROM type::table($table) GROUP BY marketing")
        .bind(("table", "person"))
        .await?;
    dbg!(groups);

    Ok(())
}
