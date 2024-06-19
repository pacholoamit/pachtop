import { Store } from "tauri-plugin-store";

import logger from "@/lib/logger";
import { appDataDir } from "@tauri-apps/api/path";
import { platform } from "@tauri-apps/plugin-os";

// Generic function to create get/set operations
const createStoreItem = <T>(store: Store, key: string, defaultValue: T) => ({
  get: async () => {
    const value = await store.get<T>(key);
    logger.info(`Store item ${key} value: `, value);
    return value ?? defaultValue;
  },
  set: async (value: T) => {
    logger.info(`Setting store item ${key} value: `, value);
    await store.set(key, value);
    await store.save();
  },
});

// Specialized function for sessions
const sessions = (store: Store) => ({
  get: async () => await store.get<number>("sessions"),
  increment: async () => {
    const currentSessions = (await store.get<number>("sessions")) ?? 0;
    await store.set("sessions", currentSessions + 1);
  },
});

// Specialized function for first run check
const isFirstRun = (store: Store) => ({
  get: async () => {
    const count = (await store.get<number>("sessions")) || 0;
    return count === 0;
  },
});

const createStore = async (name: string) => {
  const currentPlatform = await platform();
  const path = await appDataDir();
  const storePath = currentPlatform === "windows" ? `${path}\\${name}` : `${path}/${name}`;
  const store = new Store(storePath);

  logger.info("Store path: ", storePath);

  return {
    windowColor: createStoreItem<string>(store, "windowColor", ""), // TODO: Improve this
    theme: createStoreItem<string>(store, "theme", ""), // TODO: Improve this
    isFirstRun: isFirstRun(store),
    sessions: sessions(store),
    isDefenderExclusionEnabled: createStoreItem<boolean>(store, "isDefenderExclusionEnabled", false),
    isPerformanceModeEnabled: createStoreItem<boolean>(store, "isPerformanceModeEnabled", false),
  };
};

const initializeStore = async () => {
  return await createStore(".pachtop.dat");
};

const store = initializeStore();

export default store;
