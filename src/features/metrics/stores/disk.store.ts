import { create } from "zustand";

import { Disk, ServerEvent, streams } from "@/lib";
import createSelectors from "@/utils/create-selectors";
import { listen } from "@tauri-apps/api/event";

const DEFAULT_DISK: Disk = {
  diskType: "unknown",
  fileSystem: "unknown",
  free: 0,
  isRemovable: false,
  mountPoint: "unknown",
  total: 0,
  name: "unknown",
  timestamp: 0,
  used: 0,
  usedPercentage: 0,
};

interface DisksState {
  disks: Disk[];
  selectedDisk: Disk;
  setSelectedDisk: (disk: string) => void;
  listen: () => void;
}

const useDisksStore = create<DisksState>()((set, get) => ({
  disks: [{ ...DEFAULT_DISK }],
  selectedDisk: DEFAULT_DISK,
  setSelectedDisk: (disk: string) => {
    const state = get();
    // Hack for now.. Find by name applies to windows and find by mountpoint applies to unix
    const selectedDisk = state.disks.find((d) => d.name === disk) || state.disks.find((d) => d.mountPoint === disk) || DEFAULT_DISK;
    set({ selectedDisk });
  },

  listen: () => streams.disks((disks) => set({ disks })),
}));

// Start listening for disk events as soon as the store is created
useDisksStore.getState().listen();

const useDisksSelectors = createSelectors(useDisksStore);

export default useDisksSelectors;
