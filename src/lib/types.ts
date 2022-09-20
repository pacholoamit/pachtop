export enum TauriCommand {
  Memory = "get_memory",
  Swap = "get_swap",
  SysInfo = "get_sysinfo",
}

// typescript interfaces/types from models.rs

export interface SysInfo {
  hostname: string;
  kernelVersion: string;
  osVersion: string;
  coreCount: string;
  diskCount: string;
  timestamp: number;
}
export interface Memory {
  unit: string;
  free: number;
  total: number;
  used: number;
  timestamp: number;
}

export interface Swap {
  unit: string;
  free: number;
  total: number;
  used: number;
  timestamp: number;
}
