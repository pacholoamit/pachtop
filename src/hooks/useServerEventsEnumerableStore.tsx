import { useEffect, useState } from "react";

import useServerEventsStore from "@/hooks/useServerEventsStore";
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
    items.at(-1)?.filter((item) => {
      // If the item name is not in the uniqueItems array, add it
      if (!uniqueItems.find((unique) => unique.id === item.name)) {
        const newUniqueItem: Enumerable<T> = {
          id: item.name,
          data: [item],
        };

        setUniqueItems((prev) => [...prev, newUniqueItem]);
      }

      // If the item name is in the uniqueItems array, append the data
      const index = uniqueItems.findIndex((u) => u.id === item.name);
      if (index === -1) return;

      uniqueItems[index].data.push(item);
    });
  }, [items]);

  return [uniqueItems] as const;
};

export default useServerEventsEnumerableStore;
