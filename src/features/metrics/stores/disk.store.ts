import { create } from "zustand";

import { Disk, streams } from "@/lib";
import createSelectors from "@/utils/create-selectors";

import formatBytes from "../utils/format-bytes";
import formatOverallStats from "../utils/format-overall-stats";

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
  freePercentage: 0,
  usedPercentage: 0,
};

const DEFAULT_FORMATTED_DISK: FormattedDisk = {
  ...DEFAULT_DISK,
  free: "0",
  total: "0",
  used: "0",
  usedPercentage: 0,
  overall: "0",
};

type DiskCommonProperties = Pick<
  Disk,
  "diskType" | "fileSystem" | "isRemovable" | "mountPoint" | "name" | "timestamp" | "usedPercentage" | "freePercentage"
>;

export interface FormattedDisk extends DiskCommonProperties {
  free: string;
  total: string;
  used: string;

  overall: string;
}

interface DisksState {
  disks: Disk[];
  formattedDisks: FormattedDisk[];
  selectedDisk: Disk;
  setSelectedDisk: (disk: string) => void;
  listen: () => void;
}

const useDisksStore = create<DisksState>()((set, get) => ({
  disks: [{ ...DEFAULT_DISK }],
  formattedDisks: [{ ...DEFAULT_FORMATTED_DISK }],
  selectedDisk: DEFAULT_DISK,
  setSelectedDisk: (disk: string) => {
    const state = get();
    // Hack for now.. Find by name applies to windows and find by mountpoint applies to unix
    const selectedDisk =
      state.disks.find((d) => d.name === disk) || state.disks.find((d) => d.mountPoint === disk) || DEFAULT_DISK;
    set({ selectedDisk });
  },

  listen: () =>
    streams.disks((disks) => {
      const formatted: FormattedDisk[] = disks.map((disk) => ({
        ...disk,
        used: formatBytes(disk.used),
        total: formatBytes(disk.total),
        free: formatBytes(disk.free),
        overall: formatOverallStats(disk.used, disk.total, 2),
      }));

      set({ disks, formattedDisks: formatted });
    }),
}));

// Start listening for disk events as soon as the store is created
useDisksStore.getState().listen();

const useDisksSelectors = createSelectors(useDisksStore);

export default useDisksSelectors;
