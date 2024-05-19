import { InvokeArgs } from "@tauri-apps/api/tauri";
export * from "@/lib/bindings/Cpu";
export * from "@/lib/bindings/Disk";
export * from "@/lib/bindings/GlobalCpu";
export * from "@/lib/bindings/Memory";
export * from "@/lib/bindings/Network";
export * from "@/lib/bindings/Process";
export * from "@/lib/bindings/Swap";
export * from "@/lib/bindings/SysInfo";
export * from "@/lib/bindings/Timestamp";
export * from "@/lib/bindings/DiskItem";
export * from "@/lib/bindings/FileEntry";

export enum Command {
  KillProcess = "kill_process",
  ShowInFolder = "show_folder",
  DeepScan = "deep_scan",
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
  ThemeChanged = "theme_changed",
}

export enum DiskType {
  UNKNOWN = "Unknown",
  HDD = "HDD",
  SSD = "SSD",
}

export interface ShowInFolderOpts extends InvokeArgs {
  path: string;
}

export interface KillProcessOpts extends InvokeArgs {
  pid: string;
}

export interface DeepScanOpts extends InvokeArgs {
  path: string;
}

export type KillProcessResult = boolean;
