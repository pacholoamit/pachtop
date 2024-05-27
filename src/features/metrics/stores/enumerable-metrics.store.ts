import { create } from "zustand";

import { VIEWABLE_ELEMENT_COUNT } from "@/contants";

export interface EnumerableInput {
  name: string;
}

export interface Enumerable<T> {
  id: string;
  data: T[];
}

export interface EnumerableStore<Input extends EnumerableInput, Enumerated> {
  enumerables: Enumerable<Input>[];
  maxSize: number;
  listen: () => void;
  addEnumerable: (item: Input) => void;
  appendMetricToEnumerable: (index: number, item: Input) => void;
}

export interface EnumerableStoreInput<T> {
  default: T;
  stream: (cb: (data: T) => void) => void;
  maxSize?: number;
}

const useEnumerableMetricsStore = <Input extends EnumerableInput, Enumerated extends EnumerableInput = EnumerableInput>(
  input: EnumerableStoreInput<Input[]>
) => {
  return create<EnumerableStore<Input, Enumerated>>((set, get) => ({
    enumerables: [],
    maxSize: input.maxSize || VIEWABLE_ELEMENT_COUNT, // Default value, can be overridden in the hook

    addEnumerable: (item) => {
      set((state) => {
        const newEnumerable = {
          id: item.name,
          data: [item],
        };
        return { enumerables: [...state.enumerables, newEnumerable] };
      });
    },

    appendMetricToEnumerable: (index, item) => {
      set((state) => {
        const existingEnumerable = state.enumerables[index];
        const data = [...existingEnumerable.data, item];

        if (data.length > state.maxSize) data.shift();

        const updatedEnumerable = { ...existingEnumerable, data };

        const updatedEnumerables = [...state.enumerables];
        updatedEnumerables[index] = updatedEnumerable;

        return { enumerables: updatedEnumerables };
      });
    },

    listen: () => {
      input.stream((stream) => {
        const state = get();

        stream.forEach((item) => {
          const index = state.enumerables.findIndex((u) => u.id === item.name);
          const isExistingEnumerable = index !== -1;

          if (!isExistingEnumerable) {
            state.addEnumerable(item);
            return;
          }

          state.appendMetricToEnumerable(index, item);
        });
      });
    },
  }));
};

export default useEnumerableMetricsStore;
