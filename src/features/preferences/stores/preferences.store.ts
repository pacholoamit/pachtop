import { create } from "zustand";

import createSelectors from "@/utils/create-selectors";

type ResourceWidgetState = "used" | "free";

interface ResourceWidget {
  state: ResourceWidgetState;
  toggle: () => void;
}

// TODO: Add theme here?
interface PreferencesState {
  resourceWidgets: {
    disk: ResourceWidget;
    cpu: ResourceWidget;
    memory: ResourceWidget;
  };
}

type Set = (
  partial:
    | PreferencesState
    | Partial<PreferencesState>
    | ((state: PreferencesState) => PreferencesState | Partial<PreferencesState>)
) => void;

const createToggle = (set: Set, get: () => PreferencesState, key: keyof PreferencesState["resourceWidgets"]) => () => {
  const state = get().resourceWidgets[key];
  set((prevState) => ({
    resourceWidgets: {
      ...prevState.resourceWidgets,
      [key]: {
        ...state,
        state: state.state === "used" ? "free" : "used",
      },
    },
  }));
};

const usePreferencesStore = create<PreferencesState>()((set, get) => ({
  resourceWidgets: {
    cpu: {
      state: "used",
      toggle: createToggle(set, get, "cpu"),
    },
    memory: {
      state: "used",
      toggle: createToggle(set, get, "memory"),
    },
    disk: {
      state: "used",
      toggle: createToggle(set, get, "disk"),
    },
  },
}));

const usePreferencesSelector = createSelectors(usePreferencesStore);

export default usePreferencesSelector;
