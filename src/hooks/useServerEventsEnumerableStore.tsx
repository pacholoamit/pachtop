import useServerEventsStore from "@/hooks/useServerEventsStore";
import { useEffect, useState } from "react";
import { ServerEvent } from "@/lib/types";

export interface Enumerable<T> {
  id: string;
  data: T[];
}

interface useServerEventsEnumerableStoreInput {
  maxSize: number;
}

const useServerEventsEnumerableStore = <T extends { name: string }>(
  serverEvent: ServerEvent,
  input: useServerEventsEnumerableStoreInput
): readonly [Enumerable<T>[]] => {
  const [items] = useServerEventsStore<T[]>(serverEvent, { ...input });
  const [uniqueItems, setUniqueItems] = useState<Enumerable<T>[]>([]);

  useEffect(() => {
    items.at(-1)?.forEach((item) => {
      setUniqueItems((prev) => {
        const existingIndex = prev.findIndex((unique) => unique.id === item.name);

        if (existingIndex === -1) {
          // Item not found, add new entry
          return [...prev, { id: item.name, data: [item] }];
        } else {
          // Item found, update existing entry
          const updatedItems = [...prev];
          updatedItems[existingIndex].data = [item, ...updatedItems[existingIndex].data].slice(0, input.maxSize);
          return updatedItems;
        }
      });
    });
  }, [items, input.maxSize]);

  return [uniqueItems] as const;
};

export default useServerEventsEnumerableStore;
