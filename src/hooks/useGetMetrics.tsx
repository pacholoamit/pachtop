import { useEffect, useState } from "react";
import { invoke } from "@/lib";
import { Memory, TauriCommand } from "@/lib/types";

const useGetMetrics = () => {
  const [memory, setMemory] = useState<Memory[]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      await invoke(TauriCommand.Memory).then((res) =>
        setMemory((prev) => [...prev, res as Memory])
      );
    };

    const interval = setInterval(requestMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  return { memory };
};

export default useGetMetrics;
