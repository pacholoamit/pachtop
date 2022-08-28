import { useEffect, useState } from "react";
import { invoke } from "@/lib";
import { Memory, TauriCommand } from "@/lib/types";

const useGetMetrics = () => {
  const [memory, setMemory] = useState<Memory[]>([]);
  const requestInterval = 1000; // 1 second
  const arrayLength = 1000; // items

  useEffect(() => {
    const requestMetrics = async () => {
      const mem = (await invoke(TauriCommand.Memory)) as Memory;

      if (memory.length >= arrayLength) {
        setMemory((prev) => [...prev.slice(1), mem]);
      } else {
        setMemory((prev) => [...prev, mem]);
      }
    };

    const interval = setInterval(requestMetrics, requestInterval);

    return () => clearInterval(interval);
  }, []);

  return { memory };
};

export default useGetMetrics;
