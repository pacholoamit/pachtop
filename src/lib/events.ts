import { emit, listen } from "@tauri-apps/api/event";

import { Cpu, Disk, GlobalCpu, Memory, Network, Process, ServerEvent, Swap, SysInfo } from "./types";

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

  swap: (callback: (data: Swap) => void) => {
    listen<Swap>(ServerEvent.Swap, ({ payload }) => callback(payload));
  },

  memory: (callback: (data: Memory) => void) => {
    listen<Memory>(ServerEvent.Memory, ({ payload }) => callback(payload));
  },

  network: (callback: (data: Network[]) => void) => {
    listen<Network[]>(ServerEvent.Networks, ({ payload }) => callback(payload));
  },
};
