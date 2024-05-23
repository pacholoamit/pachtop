import { create } from "zustand";

import { GlobalCpu, streams, SysInfo } from "@/lib";
import createSelectors from "@/utils/create-selectors";

const DEFAULT_GLOBAL_CPU: GlobalCpu = {
  brand: "unknown",
  frequency: BigInt(0),
  name: "unknown",
  timestamp: BigInt(0),
  usage: 0,
  vendor: "unknown",
};
interface GlobalCpuState {
  globalCpu: GlobalCpu;
  listen: () => void;
}

const useGlobalCpuStore = create<GlobalCpuState>()((set, get) => ({
  globalCpu: DEFAULT_GLOBAL_CPU,
  listen: () => streams.globalCpu((globalCpu) => set({ globalCpu })),
}));

useGlobalCpuStore.getState().listen();

const useGlobalCpuSelectors = createSelectors(useGlobalCpuStore);

export default useGlobalCpuSelectors;
