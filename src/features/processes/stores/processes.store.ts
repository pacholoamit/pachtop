import { create } from "zustand";

import { GlobalCpu, Process, streams, SysInfo } from "@/lib";
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
  diskUsage: {
    readBytes: 0,
    totalReadBytes: 0,
    totalWrittenBytes: 0,
    writtenBytes: 0,
  },
};
interface ProcessesState {
  processes: Process[];
  listen: () => void;
}

const useProcessesStore = create<ProcessesState>()((set, get) => ({
  processes: [DEFAULT_PROCESS],
  listen: () => streams.processes((processes) => set({ processes })),
}));

useProcessesStore.getState().listen();

const useProcessesSelectors = createSelectors(useProcessesStore);

export default useProcessesSelectors;
