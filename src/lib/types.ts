import { InvokeArgs } from "@tauri-apps/api/core";

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
export * from "@/lib/bindings/DiskAnalysisProgress";
export * from "@/lib/bindings/DiskScanInput";

export enum Command {
  KillProcess = "kill_process",
  ShowInFolder = "show_folder",
  DiskScan = "disk_scan",
  DiskAnalysisFlattened = "disk_analysis_flattened",
  AddPachtopExclusion = "add_pachtop_exclusion",
}

export enum ServerEvent {
  DiskAnalysisProgress = "disk_analysis_progress",
  SysInfo = "emit_sysinfo",
  GlobalCpu = "emit_global_cpu",
  Cpus = "emit_cpus",
  Memory = "emit_memory",
  Swap = "emit_swap",
  Networks = "emit_networks",
  Disks = "emit_disks",
  Processes = "emit_processes",
  ThemeChanged = "theme_changed",
  WindowWillEnterFullScreen = "will-enter-fullscreen",
  WindowWillExitFullScreen = "will-exit-fullscreen",
}

export enum DiskType {
  UNKNOWN = "Unknown",
  HDD = "HDD",
  SSD = "SSD",
}

export interface ShowInFolderOpts {
  path: string;
}

export interface KillProcessOpts {
  name: string;
}

export interface ScanOpts {
  path: string;
}

export type KillProcessResult = boolean;
