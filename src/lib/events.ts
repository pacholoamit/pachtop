import { emit, listen } from "@tauri-apps/api/event";

import { Cpu, Disk, GlobalCpu, Process, ServerEvent, SysInfo } from "./types";

export const setWindowColor = (color: string) => emit(ServerEvent.ThemeChanged, color);

export const streams = {
  systemInformation: (callback: (data: SysInfo) => void) => {
    listen<SysInfo>(ServerEvent.SysInfo, ({ payload }) => callback(payload));
  },

  disks: (callback: (data: Disk[]) => void) => {
    listen<Disk[]>(ServerEvent.Disks, ({ payload }) => callback(payload));
  },

  globalCpu: (callback: (data: GlobalCpu) => void) => {
    listen<GlobalCpu>(ServerEvent.GlobalCpu, ({ payload }) => callback(payload));
  },

  cpus: (callback: (data: Cpu[]) => void) => {
    listen<Cpu[]>(ServerEvent.Cpus, ({ payload }) => callback(payload));
  },

  processes: (callback: (data: Process[]) => void) => {
    listen<Process[]>(ServerEvent.Processes, ({ payload }) => callback(payload));
  },
};
