import { Store } from "tauri-plugin-store";

import logger from "@/lib/logger";
import { appDataDir } from "@tauri-apps/api/path";
import { platform } from "@tauri-apps/plugin-os";

// Currently not being used, implement on PostHog maybe?
const userId = (store: Store) => {
  return {
    get: async () => await store.get<string>("userId"),
    set: async (value: string) => {
      await store.set("userId", value);
      await store.save();
    },
  };
};

const windowColor = (store: Store) => {
  return {
    get: async () => await store.get<string>("windowColor"),
    set: async (value: string) => {
      await store.set("windowColor", value);
      await store.save();
    },
  };
};

const theme = (store: Store) => {
  return {
    get: async () => await store.get<string>("theme"),
    set: async (value: string) => {
      await store.set("theme", value);
      await store.save();
    },
  };
};

const isFirstRun = (store: Store) => {
  return {
    get: async () => {
      const count = (await store.get<number>("sessions")) || 0;
      return count === 0;
    },
  };
};

const sessions = (store: Store) => {
  return {
    get: async () => await store.get<number>("sessions"),
    increment: async () => {
      const currentSessions = (await store.get<number>("sessions")) ?? 0;
      await store.set("sessions", currentSessions + 1);
    },
  };
};

const isDefenderExclusionEnabled = (store: Store) => {
  return {
    get: async () => await store.get<boolean>("isDefenderExclusionEnabled"),
    set: async (value: boolean) => {
      await store.set("isDefenderExclusionEnabled", value);
      await store.save();
    },
  };
};

const isPerformanceModeEnabled = (store: Store) => {
  return {
    get: async () => (await store.get<boolean>("isPerformanceModeEnabled")) || false,
    set: async (value: boolean) => {
      await store.set("isPerformanceModeEnabled", value);
      await store.save();
    },
  };
};

const createStore = async (name: string) => {
  const currentPlatform = await platform();
  const path = await appDataDir();

  const storePath = currentPlatform === "windows" ? `${path}\\${name}` : `${path}/${name}`;

  const store = new Store(storePath);
  logger.info("Store path: ", storePath);

  return {
    userId: userId(store),
    windowColor: windowColor(store),
    theme: theme(store),
    isFirstRun: isFirstRun(store),
    sessions: sessions(store),
    isDefenderExclusionEnabled: isDefenderExclusionEnabled(store),
    isPerformanceModeEnabled: isPerformanceModeEnabled(store),
  };
};

const initializeStore = async () => {
  return await createStore(".pachtop.dat");
};

const store = initializeStore();

export default store;
