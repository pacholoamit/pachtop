import { useEffect, useState } from "react";
import { useQueue } from "@mantine/hooks";
import { invoke } from "@/lib";
import { Memory, TauriCommand } from "@/lib/types";

const useGetMetrics = () => {
  const [memory, setMemory] = useState<Memory[]>([]);
  const requestInterval = 1000; // 1 second
  const arrayLength = 10; // items

  useEffect(() => {
    const requestMetrics = async () => {
      const mem = await invoke(TauriCommand.Memory);

      if (memory.length < arrayLength) {
        setMemory((prev) => [...prev, mem as Memory]);
      }
      setMemory((prev) => [...prev.slice(1), mem as Memory]);
    };

    const interval = setInterval(requestMetrics, requestInterval);
    return () => clearInterval(interval);
  }, []);

  return { memory };
};

export default useGetMetrics;
