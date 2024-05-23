import { create } from "zustand";

import { GlobalCpu, Process, streams, SysInfo } from "@/lib";
import createSelectors from "@/utils/create-selectors";

const DEFAULT_PROCESS: Process = {
  cpuUsage: 0,
  memoryUsage: 0,
  name: "unknown",
  pid: "1",
  status: "unknown",
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
