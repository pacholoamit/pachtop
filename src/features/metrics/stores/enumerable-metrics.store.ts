import { create } from "zustand";

interface EnumerableInput {
  name: string;
}

interface Enumerable<T> {
  id: string;
  data: T[];
}

interface EnumerableStore<T> {
  enumerables: Enumerable<T>[];
  maxSize: number;
  listen: () => void;
}

interface EnumerableStoreInput<T> {
  default: T;
  stream: (cb: (data: T) => void) => void;
}

const useEnumerableMetricsStore = <T extends EnumerableInput[]>(input: EnumerableStoreInput<T>) => {
  return create<EnumerableStore<T>>()((set, get) => ({
    enumerables: [],
    maxSize: 100, // Default value, can be overridden in the hook

    listen: () => {
      input.stream((stream) => {
        const state = get();

        // TODO: Set correct types for item
        stream.find((item) => {
          // If the item name is not in the uniqueItems array, add it
          if (!state.enumerables.find((unique) => unique.id === item.name)) {
            const newEnumerable: Enumerable<T> = {
              id: item.name,
              data: [item as any],
            };

            set((state) => ({ enumerables: [...state.enumerables, newEnumerable] }));
          }

          // If the item name is in the uniqueItems array, append the data
          const index = state.enumerables.findIndex((u) => u.id === item.name);
          if (index === -1) return;

          state.enumerables[index].data.push(item as any);
        });
      });
    },
  }));
};

export default useEnumerableMetricsStore;
