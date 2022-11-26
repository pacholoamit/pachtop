export enum TauriCommand {
  Memory = "get_memory",
  Swap = "get_swap",
  SysInfo = "get_sysinfo",
  GlobalCpu = "get_global_cpu",
  Networks = "get_networks",
  Cpus = "get_cpus",
  Disks = "get_disks",
  Processes = "get_processes",
}

// typescript interfaces/types from models.rs

type Timestamp = number;

export interface SysInfo {
  hostname: string;
  kernelVersion: string;
  osVersion: string;
  coreCount: string;
  timestamp: Timestamp;
}

export interface Memory {
  free: number;
  total: number;
  used: number;
  usedPercentage: number;
  timestamp: Timestamp;
}

export interface GlobalCpu {
  usage: number;
  brand: string;
  frequency: number;
  name: string;
  vendor: string;
  timestamp: Timestamp;
}

export interface Cpu {
  name: string;
  usage: number;
  timestamp: Timestamp;
}

export interface Swap {
  free: number;
  total: number;
  used: number;
  usedPercentage: number;
  timestamp: Timestamp;
}

export interface Network {
  name: string;
  received: number;
  transmitted: number;
  timestamp: Timestamp;
}

export interface Disk {
  name: string;
  free: number;
  total: number;
  used: number;
  mountPoint: string;
  fileSystem: string;
  diskType: string;
  isRemovable: boolean;
  timestamp: Timestamp;
}

export interface Process {
  name: string;
  pid: string
  cpuUsage: string
  memoryUsage: string;
  status: string;
  timestamp: Timestamp;
}