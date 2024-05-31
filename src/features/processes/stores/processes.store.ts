import { create } from "zustand";

import { Process, streams } from "@/lib";
import createSelectors from "@/utils/create-selectors";

export const DEFAULT_PROCESS: Process = {
  cpuUsage: 0,
  memoryUsage: 0,
  name: "unknown",
  cmd: [],
  exe: "unknown",
  root: "unknown",
  runTime: 0,
  startTime: 0,
  status: "unknown",
  icon: "",
  diskUsage: {
    readBytes: 0,
    totalReadBytes: 0,
    totalWrittenBytes: 0,
    writtenBytes: 0,
  },
  timestamp: 0,
};
interface ProcessesState {
  processes: Process[];
  listen: () => void;
}
// TODO: Use enumerable store instead of this
const useProcessesStore = create<ProcessesState>()((set) => ({
  processes: [DEFAULT_PROCESS],
  listen: () => streams.processes((processes) => set({ processes })),
}));

useProcessesStore.getState().listen();

const useProcessesSelectors = createSelectors(useProcessesStore);

export default useProcessesSelectors;
