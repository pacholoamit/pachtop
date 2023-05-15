import { InvokeArgs } from "@tauri-apps/api/tauri";

export enum Command {
  KillProcess = "kill_process",
  ShowInFolder = "show_folder",
}

export enum ServerEvent {
  SysInfo = "emit_sysinfo",
  GlobalCpu = "emit_global_cpu",
  Cpus = "emit_cpus",
  Memory = "emit_memory",
  Swap = "emit_swap",
  Networks = "emit_networks",
  Disks = "emit_disks",
  Processes = "emit_processes",
}

export interface ShowInFolderOpts extends InvokeArgs {
  path: string;
}

export interface KillProcessOpts extends InvokeArgs {
  pid: string;
}

export type KillProcessResult = boolean;

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
  pid: string;
  cpuUsage: number;
  memoryUsage: number;
  status: string;
}
