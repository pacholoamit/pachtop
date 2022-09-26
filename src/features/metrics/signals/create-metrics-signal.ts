import { Signal, signal, effect } from "@preact/signals-react";
import { invoke } from "@tauri-apps/api";
import { TauriCommand } from "@/lib";

export interface SignalMetricsOptions {
  interval?: number;
  maxSamples?: number;
  once?: boolean;
}
export const createMetricsSignal = <T extends {}>(
  command: TauriCommand,
  opts?: SignalMetricsOptions
): Signal<T[]> => {
  const { interval = 1000, maxSamples = 86400, once = false } = opts || {};
  const metrics = signal<T[]>([]);

  if (once) {
    invoke<T>(command).then((data) => (metrics.value = [data]));
  }

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
