import { useEffect, useState } from "react";
import { invoke } from "@/lib";
import { GlobalCpu, Memory, Swap, TauriCommand } from "@/lib/types";

interface UseGetMetricsOptions {
  interval: number;
  maxLength: number;
}

const useGetMetrics = ({ interval, maxLength }: UseGetMetricsOptions) => {
  const [globalCpu, setGlobalCpu] = useState<GlobalCpu[]>([]);
  const [memory, setMemory] = useState<Memory[]>([]);
  const [swap, setSwap] = useState<Swap[]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      const mem = (await invoke(TauriCommand.Memory)) as Memory;
      const swap = (await invoke(TauriCommand.Swap)) as Swap;
      const globalCpu = (await invoke(TauriCommand.GlobalCpu)) as GlobalCpu;

      if (memory.length >= maxLength) {
        setMemory((prev) => [...prev.slice(1), mem]);
        setSwap((prev) => [...prev.slice(1), swap]);
        setGlobalCpu((prev) => [...prev.slice(1), globalCpu]);
      } else {
        setMemory((prev) => [...prev, mem]);
        setSwap((prev) => [...prev, swap]);
        setGlobalCpu((prev) => [...prev, globalCpu]);
      }
    };

    const timer = setInterval(requestMetrics, interval);

    return () => clearInterval(timer);
  }, []);

  return { memory, swap, globalCpu };
};

export default useGetMetrics;
