import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { ServerEvent } from "@/lib/types";

interface useServerEventsStoreInput {
  maxSize: number;
}

const useServerEventsStore = <T,>(event: ServerEvent, input: useServerEventsStoreInput): readonly [T[]] => {
  const [array, setArray] = useState<T[]>([]);

  const push = (payload: T) => {
    setArray((prevArray) => {
      const newArray = [...prevArray, payload];
      if (newArray.length > input.maxSize) {
        return newArray.slice(1);
      }
      return newArray;
    });
  };

  useEffect(() => {
    listen<T>(event, ({ payload }) => push(payload));
  }, []);

  return [array] as const;
};

export default useServerEventsStore;
