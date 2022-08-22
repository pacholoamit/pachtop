import { useEffect, useState } from "react";
import { invoke } from "@/lib";
import { Memory, TauriCommand } from "@/lib/types";

const useGetMetrics = () => {
  const [memory, setMemory] = useState<Memory[]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      const mem = await invoke(TauriCommand.Memory);
      setMemory((prev) => [...prev, mem as Memory]);
    };

    const interval = setInterval(requestMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  return { memory };
};

export default useGetMetrics;
