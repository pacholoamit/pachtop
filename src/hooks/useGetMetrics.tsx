import { useEffect, useState } from "react";
import { invoke } from "@/lib";
import { Memory, TauriCommand } from "@/lib/types";

const useGetMetrics = () => {
  const [memory, setMemory] = useState<Memory[]>([]);
  const requestInterval = 1000; // 1 second
  const arrayLength = 10; // items

  useEffect(() => {
    const requestMetrics = async () => {
      const mem = await invoke(TauriCommand.Memory);
      console.log(mem);

      if (memory.length >= arrayLength) {
        setMemory((prev) => [...prev.slice(1), mem as Memory]);
      } else {
        setMemory((prev) => [...prev, mem as Memory]);
      }
    };

    console.log(memory);
    const interval = setInterval(requestMetrics, requestInterval);

    return () => clearInterval(interval);
  }, [memory]);

  return { memory };
};

export default useGetMetrics;
