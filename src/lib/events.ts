import { emit, listen } from "@tauri-apps/api/event";

import { ServerEvent, SysInfo } from "./types";

export const setWindowColor = (color: string) => emit(ServerEvent.ThemeChanged, color);

export const streamSystemInfo = (callback: (data: SysInfo) => void) =>
  listen<SysInfo>(ServerEvent.SysInfo, ({ payload }) => callback(payload));
