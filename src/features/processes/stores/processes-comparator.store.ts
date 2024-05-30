import create from "zustand";

import createSelectors from "@/utils/create-selectors";

interface ComparitorState {
  comparitorOptions: string[];
  comparitorSelected: string[];
  setComparitorOptions: (options: string[]) => void;
  setComparitorSelected: (selected: string[]) => void;
  addToComparitorSelected: (selected: string) => void;
}

const limit = 4;
const useComparitorStore = create<ComparitorState>((set, get) => ({
  comparitorOptions: [],
  comparitorSelected: [],
  setComparitorOptions: (options) => set({ comparitorOptions: options }),
  setComparitorSelected: (selected) => set({ comparitorSelected: selected }),
  addToComparitorSelected: (selected) => {
    // Don't append if limit is reached
    if (get().comparitorSelected.length >= limit) {
      return;
    }

    // Don't append if already selected
    if (get().comparitorSelected.includes(selected)) {
      return;
    }
    set((state) => ({ comparitorSelected: [...state.comparitorSelected, selected] }));
  },
}));

const useComparitorSelectors = createSelectors(useComparitorStore);

export default useComparitorSelectors;
