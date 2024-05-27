import create from "zustand";

import createSelectors from "@/utils/create-selectors";

interface ComparitorState {
  comparitorOptions: string[];
  comparitorSelected: string[];
  setComparitorOptions: (options: string[]) => void;
  setComparitorSelected: (selected: string[]) => void;
}

const useComparitorStore = create<ComparitorState>((set) => ({
  comparitorOptions: [],
  comparitorSelected: [],
  setComparitorOptions: (options) => set({ comparitorOptions: options }),
  setComparitorSelected: (selected) => set({ comparitorSelected: selected }),
}));

const useComparitorSelectors = createSelectors(useComparitorStore);

export default useComparitorSelectors;
