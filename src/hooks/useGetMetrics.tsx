import { useEffect, useState } from "react";
import { invoke, TauriCommand } from "@/lib";

interface useGetMetricsOptions {
  interval: number;
  maxLength: number;
}

const useGetMetrics = <T extends {}>(
  command: TauriCommand,
  opts?: useGetMetricsOptions
): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
  const { interval = 1000, maxLength = 86400 } = opts || {};
  const [state, setState] = useState<T[]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      const data = (await invoke(command)) as T;

      if (state.length >= maxLength) {
        setState((prev) => [...prev.slice(1), data]);
      } else {
        setState((prev) => [...prev, data]);
      }
    };

    const timer = setInterval(requestMetrics, interval);

    return () => clearInterval(timer);
  }, []);

  return [state, setState];
};

export default useGetMetrics;
