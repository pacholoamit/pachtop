export enum TauriCommand {
  Memory = "get_memory",
  Swap = "get_swap",
  SysInfo = "get_sysinfo",
  GlobalCpu = "get_global_cpu",
  Networks = "get_networks",
}

// typescript interfaces/types from models.rs

type Timestamp = number;

export interface SysInfo {
  hostname: string;
  kernelVersion: string;
  osVersion: string;
  coreCount: string;
  diskCount: string;
  timestamp: Timestamp;
}

export interface Memory {
  unit: string;
  free: number;
  total: number;
  used: number;
  timestamp: Timestamp;
}

export interface GlobalCpu {
  cpuUsage: number;
  cpuBrand: string;
  cpuFrequency: number;
  cpuName: string;
  cpuVendor: string;
  timestamp: Timestamp;
}

export interface Swap {
  unit: string;
  free: number;
  total: number;
  used: number;
  timestamp: Timestamp;
}

export interface Network {
  name: string;
  received: number;
  transmitted: number;
  timestamp: Timestamp;
}
