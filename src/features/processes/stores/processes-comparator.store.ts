import { create } from "zustand";

import createSelectors from "@/utils/create-selectors";

interface ComparatorState {
  comparatorOptions: string[];
  comparatorSelected: string[];
  setComparatorOptions: (options: string[]) => void;
  setComparatorSelected: (selected: string[]) => void;
  addToComparatorSelected: (selected: string) => void;
}

const limit = 4;
const useComparatorStore = create<ComparatorState>()((set, get) => ({
  comparatorOptions: [],
  comparatorSelected: [],
  setComparatorOptions: (options) => set({ comparatorOptions: options }),
  setComparatorSelected: (selected) => set({ comparatorSelected: selected }),
  addToComparatorSelected: (selected) => {
    // Don't append if limit is reached
    if (get().comparatorSelected.length >= limit) {
      return;
    }

    // Don't append if already selected
    if (get().comparatorSelected.includes(selected)) {
      return;
    }
    set((state) => ({ comparatorSelected: [...state.comparatorSelected, selected] }));
  },
}));

const useComparatorSelectors = createSelectors(useComparatorStore);

export default useComparatorSelectors;
