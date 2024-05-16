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
