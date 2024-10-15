import { create } from 'zustand';

import { streams, SysInfo } from '@/lib';
import createSelectors from '@/utils/create-selectors';

const DEFAULT_SYS_INFO: SysInfo = {
  coreCount: 0,
  hostname: "unknown",
  kernelVersion: "unknown",
  osVersion: "unknown",
  os: "unknown",
  arch: "unknown",
  uptime: "Not Available",
};

interface SystemState {
  info: SysInfo;
  listen: () => void;
}

const useSystemStore = create<SystemState>()((set, get) => ({
  info: DEFAULT_SYS_INFO,
  listen: () => streams.systemInformation((data) => set({ info: data })),
}));

useSystemStore.getState().listen();

const useSystemStoreSelectors = createSelectors(useSystemStore);

export default useSystemStoreSelectors;
