use crate::models::*;
use crate::utils::{current_time, get_percentage, round};
use rayon::prelude::*;
use std::cmp::Ordering;
use std::collections::HashMap;
use std::str::{self, FromStr};
use sysinfo::{MemoryRefreshKind, Pid, System};

pub struct Metrics {
    sys: System,
    disks: sysinfo::Disks,
    networks: sysinfo::Networks,
}

impl Default for Metrics {
    fn default() -> Self {
        Metrics {
            sys: System::new_all(),
            disks: sysinfo::Disks::new_with_refreshed_list(),
            networks: sysinfo::Networks::new_with_refreshed_list(),
        }
    }
}

impl SystemInformationTrait for Metrics {
    fn get_system_information(&mut self) -> SysInfo {
        let kernel_version = System::kernel_version().unwrap_or("Unknown".to_string());
        let os_version = System::os_version().unwrap_or("Unknown".to_string());
        let hostname = System::host_name().unwrap_or("Unknown".to_string());
        let core_count = System::physical_core_count(&self.sys).unwrap_or(0);
        let os = System::long_os_version().unwrap_or("Unknown".to_string());

        SysInfo {
            kernel_version,
            os,
            os_version,
            hostname,
            core_count,
            timestamp: current_time(),
        }
    }
}

impl GlobalCpuTrait for Metrics {
    fn get_global_cpu(&mut self) -> GlobalCpu {
        self.sys.refresh_cpu();

        let cpu = self.sys.global_cpu_info();
        let sample = self.sys.cpus().first().unwrap();
        let usage = if cpu.cpu_usage().is_nan() {
            0.0
        } else {
            cpu.cpu_usage()
        };

        let brand = sample.brand().to_owned();
        let frequency = sample.frequency().to_owned();
        let name = sample.name().to_owned();
        let vendor = sample.vendor_id().to_owned();

        GlobalCpu {
            usage,
            brand,
            frequency,
            name,
            vendor,
            timestamp: current_time(),
        }
    }
}

impl CpuTrait for Metrics {
    fn get_cpus(&mut self) -> Vec<Cpu> {
        self.sys.refresh_cpu();

        let cpus: Vec<Cpu> = self
            .sys
            .cpus()
            .iter()
            .map(|cpu| {
                let name = cpu.name().to_owned();
                let usage = cpu.cpu_usage().to_owned() as u64;
                let total = 100;

                Cpu {
                    name,
                    usage: get_percentage(&usage, &total),
                    timestamp: current_time(),
                }
            })
            .collect();

        cpus
    }
}

impl DisksTrait for Metrics {
    fn find_disk(&mut self, mountpoint: &str) -> Disk {
        self.disks.refresh_list();
        self.disks.refresh();

        let disk = self
            .disks
            .iter()
            .find(|disk| match disk.mount_point().to_str() {
                Some(mount) => mount == mountpoint,
                None => false,
            });

        match disk {
            Some(disk) => Disk {
                name: disk.name().to_str().unwrap_or("Unknown").to_owned(),
                free: disk.available_space(),
                used: disk.total_space() - disk.available_space(),
                total: disk.total_space(),
                mount_point: disk.mount_point().to_owned(),
                file_system: disk.file_system().to_str().unwrap_or("Unknown").to_owned(),

                is_removable: disk.is_removable(),
                used_percentage: get_percentage(
                    &(disk.total_space() - disk.available_space()),
                    &disk.total_space(),
                ),
                disk_type: match disk.kind() {
                    sysinfo::DiskKind::HDD => "HDD".to_owned(),
                    sysinfo::DiskKind::SSD => "SSD".to_owned(),
                    _ => "Unknown".to_owned(),
                },
                timestamp: current_time(),
            },
            None => Disk {
                name: "Unknown".to_owned(),
                free: 0,
                used: 0,
                total: 0,
                mount_point: "Unknown".to_owned().into(),
                file_system: "Unknown".to_owned(),
                is_removable: false,
                used_percentage: 0.0,
                disk_type: "Unknown".to_owned(),
                timestamp: current_time(),
            },
        }
    }
    fn get_disks(&mut self) -> Vec<Disk> {
        self.disks.refresh_list();
        self.disks.refresh();

        let mut disks: Vec<Disk> = self
            .disks
            .iter()
            .map(|disk| {
                let name = match disk.name().to_str() {
                    Some("") => disk.mount_point().to_str().unwrap_or("Unknown").to_owned(),
                    Some(name) => name.to_owned(),
                    None => "Unknown".to_owned(),
                };

                let disk_type = match disk.kind() {
                    sysinfo::DiskKind::HDD => "HDD".to_owned(),
                    sysinfo::DiskKind::SSD => "SSD".to_owned(),
                    _ => "Unknown".to_owned(),
                };
                let file_system = disk.file_system().to_str().unwrap_or("Unknown").to_owned();

                let total = disk.total_space();
                let free = disk.available_space();
                let used = total - free;
                let is_removable = disk.is_removable();
                let mount_point = disk.mount_point().to_owned();
                let used_percentage = get_percentage(&used, &total);

                Disk {
                    name,
                    free,
                    used,
                    total,
                    mount_point,
                    file_system,
                    is_removable,
                    used_percentage,
                    disk_type,
                    timestamp: current_time(),
                }
            })
            .collect();
        // Sort disks so that the boot drive comes first (mount point containing "C://")
        // This is a hack right now
        disks.sort_by(|a, b| {
            if a.mount_point.to_str().unwrap_or("").contains("C:\\") {
                return Ordering::Less;
            }

            if b.mount_point.to_str().unwrap_or("").contains("C:\\") {
                return Ordering::Greater;
            }

            Ordering::Equal
        });

        disks
    }
}

impl MemoryTrait for Metrics {
    fn get_memory(&mut self) -> Memory {
        self.sys
            .refresh_memory_specifics(MemoryRefreshKind::new().with_ram());

        Memory {
            free: self.sys.free_memory(),
            total: self.sys.total_memory(),
            used: self.sys.used_memory(),
            used_percentage: get_percentage(&self.sys.used_memory(), &self.sys.total_memory()),
            timestamp: current_time(),
        }
    }
}

impl SwapTrait for Metrics {
    fn get_swap(&mut self) -> Swap {
        self.sys
            .refresh_memory_specifics(MemoryRefreshKind::new().with_swap());

        Swap {
            free: self.sys.free_swap(),
            total: self.sys.total_swap(),
            used: self.sys.used_swap(),
            used_percentage: get_percentage(&self.sys.used_swap(), &self.sys.total_swap()),
            timestamp: current_time(),
        }
    }
}

impl ProcessesTrait for Metrics {
    fn get_processes(&mut self) -> Vec<Process> {
        self.sys.refresh_processes();

        let mut process_map: HashMap<String, Process> = HashMap::new();
        let core_count = self.sys.physical_core_count().unwrap_or(1);

        // Aggregate metrics for each group
        self.sys.processes().values().for_each(|process| {
            if let Some(process_in_map) = process_map.get_mut(process.name()) {
                // Aggregate metrics into the existing process entry
                process_in_map.cpu_usage += process.cpu_usage() / core_count as f32;
                process_in_map.memory_usage += process.memory();
                process_in_map.disk_usage.read_bytes += process.disk_usage().read_bytes;
                process_in_map.disk_usage.written_bytes += process.disk_usage().written_bytes;
                process_in_map.disk_usage.total_read_bytes += process.disk_usage().total_read_bytes;
                process_in_map.disk_usage.total_written_bytes +=
                    process.disk_usage().total_written_bytes;
            } else {
                // Insert the process as a new entry in the map
                process_map.insert(
                    process.name().to_owned(),
                    Process {
                        name: process.name().to_owned(),
                        cmd: process.cmd().to_owned(),
                        disk_usage: ProcessDiskUsage {
                            read_bytes: process.disk_usage().read_bytes,
                            written_bytes: process.disk_usage().written_bytes,
                            total_read_bytes: process.disk_usage().total_read_bytes,
                            total_written_bytes: process.disk_usage().total_written_bytes,
                        },
                        exe: match process.exe() {
                            Some(exe) => exe.to_str().unwrap_or_default().to_owned(),
                            None => "".to_owned(),
                        },
                        root: match process.root() {
                            Some(exe) => exe.to_str().unwrap_or_default().to_owned(),
                            None => "".to_owned(),
                        },
                        start_time: process.start_time(),
                        run_time: process.run_time(),
                        cpu_usage: process.cpu_usage() / core_count as f32,
                        memory_usage: process.memory(),
                        status: match process.status() {
                            sysinfo::ProcessStatus::Run => "Running".to_owned(),
                            sysinfo::ProcessStatus::Sleep => "Sleeping".to_owned(),
                            sysinfo::ProcessStatus::Idle => "Idle".to_owned(),
                            sysinfo::ProcessStatus::Zombie => "Zombie".to_owned(),
                            sysinfo::ProcessStatus::Stop => "Stopped".to_owned(),
                            _ => "Unknown".to_owned(),
                        },
                    },
                );
            }
        });

        process_map.values().cloned().collect()
    }

    fn kill_process(&mut self, pid: &str) -> bool {
        let pid = match Pid::from_str(pid) {
            Ok(pid) => pid,
            Err(_) => return false,
        };

        let process = match self.sys.process(pid) {
            Some(process) => process,
            None => return false,
        };

        process.kill()
    }
}

impl NetworkTrait for Metrics {
    fn get_networks(&mut self) -> Vec<Network> {
        self.networks.refresh_list();
        self.networks.refresh();

        let networks: Vec<Network> = self
            .networks
            .iter()
            .map(|(name, network)| {
                let name = name.to_owned();

                Network {
                    name,
                    received: network.received(),
                    transmitted: network.transmitted(),
                    timestamp: current_time(),
                }
            })
            .collect();

        networks
    }
}
