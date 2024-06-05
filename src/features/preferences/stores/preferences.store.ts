import { create } from "zustand";

import createSelectors from "@/utils/create-selectors";

type ResourceWidgetState = "used" | "free";

// TODO: Add theme here?
interface PreferencesState {
  resourceWidgets: {
    disk: {
      state: ResourceWidgetState;
      toggle: () => void;
    };
    cpu: {
      state: ResourceWidgetState;
      toggle: () => void;
    };
    memory: {
      state: ResourceWidgetState;
      toggle: () => void;
    };
  };
}

const usePreferencesStore = create<PreferencesState>()((set, get) => ({
  resourceWidgets: {
    cpu: {
      state: "used",
      toggle: () => {
        const state = get().resourceWidgets.cpu;
        set({
          resourceWidgets: {
            ...get().resourceWidgets,
            cpu: {
              ...state,
              state: state.state === "used" ? "free" : "used",
            },
          },
        });
      },
    },
    memory: {
      state: "used",
      toggle: () => {
        const state = get().resourceWidgets.memory;
        set({
          resourceWidgets: {
            ...get().resourceWidgets,
            memory: {
              ...state,
              state: state.state === "used" ? "free" : "used",
            },
          },
        });
      },
    },
    disk: {
      state: "used",
      toggle: () => {
        const state = get().resourceWidgets.disk;
        set({
          resourceWidgets: {
            ...get().resourceWidgets,
            disk: {
              ...state,
              state: state.state === "used" ? "free" : "used",
            },
          },
        });
      },
    },
  },
}));

const usePreferencesSelector = createSelectors(usePreferencesStore);

export default usePreferencesSelector;
