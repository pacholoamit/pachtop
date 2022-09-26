import { signal } from "@preact/signals-core";
import { GlobalCpu, TauriCommand } from "@/lib/types";
import { invoke } from "@tauri-apps/api";
import { effect } from "@preact/signals-react";

interface SignalMetricsOptions {
  interval: number;
  maxSamples: number;
}
const signalMetrics = async <T extends {}>(
  command: TauriCommand,
  opts?: SignalMetricsOptions
) => {
  const { interval = 1000, maxSamples = 86400 } = opts || {};
  const metrics = signal<T[]>([]);

  effect(() => {
    const update = async () => {
      const data = await invoke<T>(command);
      if (metrics.value.length >= maxSamples) {
        metrics.value = [...metrics.value.slice(1), data];
      } else {
        metrics.value = [...metrics.value, data];
      }
    };

    const timer = setInterval(update, interval);

    return () => clearInterval(timer);
  });

  return metrics;
};

export const globalCpu = await signalMetrics<GlobalCpu>(TauriCommand.GlobalCpu);
