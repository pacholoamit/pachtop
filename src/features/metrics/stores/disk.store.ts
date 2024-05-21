import { create } from "zustand";

import { Disk, ServerEvent } from "@/lib";
import { listen } from "@tauri-apps/api/event";

const DEFAULT_DISK: Disk = {
  diskType: "unknown",
  fileSystem: "unknown",
  free: 0,
  isRemovable: false,
  mountPoint: "unknown",
  total: 0,
  name: "unknown",
  timestamp: BigInt(0),
  used: 0,
  usedPercentage: 0,
};
interface DisksState {
  disks: Disk[];
  viewedDisk: Disk;
  setViewedDisk: (disk: string) => void;
  listenForDisks: () => void;
}

const useDisksStore = create<DisksState>()((set, get) => ({
  disks: [],
  viewedDisk: DEFAULT_DISK,
  setViewedDisk: (disk: string) => {
    const state = get();
    const viewedDisk = state.disks.find((d) => d.name === disk) || DEFAULT_DISK;
    set({ viewedDisk });
  },

  listenForDisks: () => {
    listen<Disk[]>(ServerEvent.Disks, ({ payload }) => {
      set((state) => ({
        disks: payload,
      }));
    });
  },
}));

// Start listening for disk events as soon as the store is created
useDisksStore.getState().listenForDisks();

export default useDisksStore;
