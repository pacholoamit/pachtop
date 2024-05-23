import { create } from "zustand";

import { VIEWABLE_ELEMENT_COUNT } from "@/contants";

interface MetricsState<T> {
  metrics: T[];
  latest: T;
  limit: number;
  setLimit: (limit: number) => void;
  add: (data: T) => void;
  remove: () => void;
  clear: () => void;
  listen: () => void;
}

interface MetricsStoreInput<T> {
  default: T;
  stream: (cb: (data: T) => void) => void;
}

const useMetricsStore = <T>(input: MetricsStoreInput<T>) => {
  return create<MetricsState<T>>()((set, get) => ({
    metrics: [input.default],
    latest: input.default,
    limit: VIEWABLE_ELEMENT_COUNT,
    setLimit: (limit: number) => set({ limit }),
    add: (data: T) => set((state) => ({ metrics: [...state.metrics, data] })),
    remove: () => set((state) => ({ metrics: state.metrics.slice(1) })),
    clear: () => set({ metrics: [] }),
    listen: () =>
      input.stream((stream) => {
        const state = get();
        const buffer = [...state.metrics, stream];
        if (buffer.length > state.limit) {
          buffer.shift();
        }

        set({ latest: stream });
        set({ metrics: buffer });
      }),
  }));
};

export default useMetricsStore;
