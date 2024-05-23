import { create } from "zustand";

import { ServerEvent, streamSystemInfo, SysInfo } from "@/lib";
import createSelectors from "@/utils/create-selectors";
import { listen } from "@tauri-apps/api/event";

const DEFAULT_SYS_INFO: SysInfo = {
  coreCount: "0",
  hostname: "unknown",
  kernelVersion: "unknown",
  osVersion: "unknown",
  timestamp: BigInt(0),
};
interface SystemState {
  info: SysInfo;
  listen: () => void;
}

const useSystemStore = create<SystemState>()((set, get) => ({
  info: DEFAULT_SYS_INFO,
  listen: () => {
    streamSystemInfo((data) => {
      set({ info: data });
    });
  },
}));

useSystemStore.getState().listen();

const useSystemStoreSelectors = createSelectors(useSystemStore);

export default useSystemStoreSelectors;
