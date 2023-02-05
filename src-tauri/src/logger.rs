use log::LevelFilter;
use log4rs::append::console::ConsoleAppender;
use log4rs::append::file::FileAppender;
use log4rs::config::{Appender, Config, Logger, Root};
use log4rs::encode::pattern::PatternEncoder;

fn logger() {
    let stdout = ConsoleAppender::builder().build();

    let logfile = FileAppender::builder()
        .encoder(Box::new(PatternEncoder::new("{d} - {m}{n}")))
        .build("pachtop.log")?;

    let config = Config::builder()
        .appender(Appender::builder().build("stdout", Box::new(stdout)))
        .appender(Appender::builder().build("logfile", Box::new(requests)))
        .build(Root::builder().appender("logfile").build(LevelFilter::info))
        .unwrap();

    let handle = log4rs::init_config(config).unwrap();
}
