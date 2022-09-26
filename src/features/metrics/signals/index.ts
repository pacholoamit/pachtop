import { GlobalCpu, Memory, TauriCommand } from "@/lib/types";
import { createMetricsSignal } from "@/features/metrics/signals/create-metrics-signal";
import createNetworkSignal from "@/features/metrics/signals/create-network-signal";

export const globalCpu = createMetricsSignal<GlobalCpu>(TauriCommand.GlobalCpu);
export const memory = createMetricsSignal<Memory>(TauriCommand.Memory);
export const swap = createMetricsSignal<Memory>(TauriCommand.Swap);
export const networks = createNetworkSignal();
