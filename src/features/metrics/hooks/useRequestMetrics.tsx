import { useEffect, useState } from "react";
import { invoke, Command } from "@/lib";

interface UseRequestMetricsOptions {
  interval?: number;
  maxLength?: number;
  latestOnly?: boolean;
}

const useRequestMetrics = <T extends {}>(
  command: Command,
  opts?: UseRequestMetricsOptions
): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
  const { interval = 1000, maxLength = 86400, latestOnly = false } = opts || {};
  const [state, setState] = useState<T[]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      const data = (await invoke(command)) as T;

      if (latestOnly) {
        setState([data]);
        return;
      }

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

export default useRequestMetrics;
