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
  addEnumerable: (item: T) => void;
  updateEnumerable: (index: number, item: any) => void;
}

interface EnumerableStoreInput<T> {
  default: T;
  stream: (cb: (data: T) => void) => void;
}

const useEnumerableMetricsStore = <T extends EnumerableInput[]>(input: EnumerableStoreInput<T>) => {
  return create<EnumerableStore<T>>()((set, get) => ({
    enumerables: [],
    maxSize: 100, // Default value, can be overridden in the hook

    addEnumerable: (item: any) => {
      set((state) => {
        const newEnumerable: Enumerable<T> = {
          id: item.name,
          data: [item],
        };
        return { enumerables: [...state.enumerables, newEnumerable] };
      });
    },

    updateEnumerable: (index: number, item: any) => {
      set((state) => {
        const newEnumerable = state.enumerables[index];
        const newData = [...newEnumerable.data, item];

        if (newData.length > state.maxSize) {
          newData.shift();
        }

        const updatedEnumerable = {
          ...newEnumerable,
          data: newData,
        };

        const updatedEnumerables = [...state.enumerables];
        updatedEnumerables[index] = updatedEnumerable;

        return { enumerables: updatedEnumerables };
      });
    },

    listen: () => {
      input.stream((stream) => {
        const state = get();
        stream.find((item) => {
          const index = state.enumerables.findIndex((u) => u.id === item.name);

          if (index === -1) {
            get().addEnumerable(item);
          } else {
            get().updateEnumerable(index, item);
          }
        });
      });
    },
  }));
};

export default useEnumerableMetricsStore;
