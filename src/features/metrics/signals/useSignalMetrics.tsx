import { useEffect, useState } from "react";
import { invoke, TauriCommand } from "@/lib";
import { useSignal, useComputed, Signal } from "@preact/signals-react";

interface useSignalMetricsOptions {
  interval: number;
  maxLength: number;
}

const useSignalMetrics = <T extends {}>(
  command: TauriCommand,
  opts?: useSignalMetricsOptions
): [Signal<T[]>] => {
  const { interval = 1000, maxLength = 86400 } = opts || {};
  const metrics = useSignal<T[]>([]);

  useEffect(() => {
    const requestMetrics = async () => {
      const data = (await invoke(command)) as T;

      if (metrics.value.length >= maxLength) {
        metrics.value = [...metrics.value.slice(1), data];
      } else {
        metrics.value = [...metrics.value, data];
      }
    };

    const timer = setInterval(requestMetrics, interval);

    return () => clearInterval(timer);
  }, []);

  return [metrics];
};

export default useSignalMetrics;
