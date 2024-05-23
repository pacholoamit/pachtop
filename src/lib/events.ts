import { emit, listen } from '@tauri-apps/api/event';

import { Disk, ServerEvent, SysInfo } from './types';

export const setWindowColor = (color: string) => emit(ServerEvent.ThemeChanged, color);

export const streams = {
  systemInformation: (callback: (data: SysInfo) => void) => {
    listen<SysInfo>(ServerEvent.SysInfo, ({ payload }) => callback(payload));
  },

  disks: (callback: (data: Disk[]) => void) => {
    listen<Disk[]>(ServerEvent.Disks, ({ payload }) => callback(payload));
  }
};
