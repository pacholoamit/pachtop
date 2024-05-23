import { create } from "zustand";

import { VIEWABLE_ELEMENT_COUNT } from "@/contants";
import { GlobalCpu, streams } from "@/lib";
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
  metrics: GlobalCpu[];
  latest: GlobalCpu;
  limit: number;
  setLimit: (limit: number) => void;
  add: (data: GlobalCpu) => void;
  remove: () => void;
  clear: () => void;
  listen: () => void;
}

const useGlobalCpuStore = create<GlobalCpuState>()((set, get) => ({
  metrics: [DEFAULT_GLOBAL_CPU],
  latest: DEFAULT_GLOBAL_CPU,
  limit: VIEWABLE_ELEMENT_COUNT,
  setLimit: (limit: number) => set({ limit }),
  add: (data: GlobalCpu) => set((state) => ({ metrics: [...state.metrics, data] })),
  remove: () => set((state) => ({ metrics: state.metrics.slice(1) })),
  clear: () => set({ metrics: [] }),
  listen: () =>
    streams.globalCpu((stream) => {
      const state = get();
      const buffer = [...state.metrics, stream];
      if (buffer.length > state.limit) {
        buffer.shift();
      }

      set({ latest: stream });
      set({ metrics: buffer });
    }),
}));

useGlobalCpuStore.getState().listen();

const useGlobalCpuSelectors = createSelectors(useGlobalCpuStore);

export default useGlobalCpuSelectors;
