import { Store } from "tauri-plugin-store";

const userId = (store: Store) => {
  return {
    get: async () => await store.get<string>("userId"),
    set: async (value: string) => {
      await store.set("userId", value);
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

const createStore = (path: string) => {
  const store = new Store(path);

  return {
    userId: userId(store),
    theme: theme(store),
  };
};

const store = createStore(".pachtop.dat");

export default store;
