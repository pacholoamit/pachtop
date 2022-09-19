import { useEffect, useState } from "react";
import { invoke } from "@/lib";
import { Memory, Swap, TauriCommand } from "@/lib/types";

interface UseGetMetricsOptions {
  interval: number;
  maxLength: number;
}

const useGetMetrics = ({ interval, maxLength }: UseGetMetricsOptions) => {
  const [memory, setMemory] = useState<Memory[]>([]);
  const [swap, setSwap] = useState<Swap[]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      const mem = (await invoke(TauriCommand.Memory)) as Memory;
      const swap = (await invoke(TauriCommand.Swap)) as Swap;

      if (memory.length >= maxLength) {
        setMemory((prev) => [...prev.slice(1), mem]);
        setSwap((prev) => [...prev.slice(1), swap]);
      } else {
        setMemory((prev) => [...prev, mem]);
        setSwap((prev) => [...prev, swap]);
      }
    };

    const timer = setInterval(requestMetrics, interval);

    return () => clearInterval(timer);
  }, []);

  return { memory, swap };
};

export default useGetMetrics;
