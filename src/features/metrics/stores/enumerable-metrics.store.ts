import { create } from "zustand";

interface MetricsEnumerableState<T extends Enumerable[]> {
  enumerables: Map<string, T>;
  enumerableByName: (name: string) => T;
  listen: () => void;
}

interface MetricsEnumerableStoreInput<T extends Enumerable[]> {
  default: T;
  stream: (cb: (data: T) => void) => void;
}

interface Enumerable {
  // NOTE: Name acts as a key for the enumerable
  name: string;
}

const useEnumerableMetricsStore = <T extends Enumerable[]>(input: MetricsEnumerableStoreInput<T>) => {
  return create<MetricsEnumerableState<T>>()((set, get) => ({
    enumerables: new Map<string, T>([["default", input.default] as [string, T]]),
    enumerableByName: (name: string) => get().enumerables.get(name) || input.default,

    listen: () =>
      input.stream((events) => {
        const state = get();

        events.forEach((event) => {
          if (!state.enumerables.has(event.name)) {
            state.enumerables.set(event.name, input.default);
            return;
          }

          // Find enumerable by name that has the same name as event
          if (state.enumerables.has(event.name)) {
            const enumerable = state.enumerables.get(event.name);
            enumerable && enumerable.push(event);
          }
        });
      }),
  }));
};

export default useEnumerableMetricsStore;
