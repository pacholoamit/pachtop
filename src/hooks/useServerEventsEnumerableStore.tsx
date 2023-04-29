import useServerEventsStore from "@/hooks/useServerEventsStore";
import { useEffect, useState } from "react";
import { ServerEvent } from "@/lib/types";

export interface Enumerable<T> {
  id: string;
  data: T[];
}

const useServerEventsEnumerableStore = <T extends { name: string }>(serverEvent: ServerEvent) => {
  const [items] = useServerEventsStore<T[]>(serverEvent, { maxSize: 100 });
  const [uniqueItems, setUniqueItems] = useState<Enumerable<T>[]>([]);

  useEffect(() => {
    items.at(-1)?.filter((item) => {
      if (!uniqueItems.find((unique) => unique.id === item.name)) {
        const newUniqueItem: Enumerable<T> = {
          id: item.name,
          data: [item],
        };

        setUniqueItems((prev) => [...prev, newUniqueItem]);
      }

      const index = uniqueItems.findIndex((u) => u.id === item.name);
      if (index === -1) return;
      uniqueItems[index].data.push(item);
    });
  }, [items]);

  return [uniqueItems];
};

export default useServerEventsEnumerableStore;
