use std::sync::{Arc, Mutex};

use sysinfo::{Pid, ProcessExt, Signal, System, SystemExt};

pub struct ActionsState(Arc<Mutex<Actions>>);

impl ActionsState {
    pub fn new(sys: System) -> Self {
        ActionsState(Arc::new(Mutex::new(Actions { sys })))
    }
}

struct Actions {
    sys: System,
}

impl Actions {
    fn kill_process(&mut self, pid: Pid) -> bool {
        let process = match self.sys.process(Pid::from(pid)) {
            Some(d) => d,
            None => return false,
        };

        let result = match process.kill_with(Signal::Kill) {
            None => false,
            Some(_) => true,
        };

        result
    }
}
