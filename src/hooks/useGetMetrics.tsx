import { useEffect, useState } from "react";
import { invoke } from "@/lib";
import { GlobalCpu, Memory, Network, Swap, TauriCommand } from "@/lib/types";
import logger from "@/lib/logger";

interface UseGetMetricsOptions {
  interval: number;
  maxLength: number;
}

const useGetMetrics = ({ interval, maxLength }: UseGetMetricsOptions) => {
  const [globalCpu, setGlobalCpu] = useState<GlobalCpu[]>([]);
  const [memory, setMemory] = useState<Memory[]>([]);
  const [swap, setSwap] = useState<Swap[]>([]);
  const [networks, setNetworks] = useState<Network[][]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      const mem = (await invoke(TauriCommand.Memory)) as Memory;
      const swap = (await invoke(TauriCommand.Swap)) as Swap;
      const globalCpu = (await invoke(TauriCommand.GlobalCpu)) as GlobalCpu;
      const network = (await invoke(TauriCommand.Networks)) as Network[];

      console.log({ network });

      if (memory.length >= maxLength) {
        console.log(mem.timestamp);
        setMemory((prev) => [...prev.slice(1), mem]);
        setSwap((prev) => [...prev.slice(1), swap]);
        setGlobalCpu((prev) => [...prev.slice(1), globalCpu]);
        setNetworks((prev) => [...prev.slice(1), network]);
      } else {
        setMemory((prev) => [...prev, mem]);
        setSwap((prev) => [...prev, swap]);
        setGlobalCpu((prev) => [...prev, globalCpu]);
        setNetworks((prev) => [...prev, network]);
      }
    };

    const timer = setInterval(requestMetrics, interval);

    return () => clearInterval(timer);
  }, []);

  return { memory, swap, globalCpu, networks };
};

export default useGetMetrics;
