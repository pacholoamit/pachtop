import { GlobalCpu, Memory, TauriCommand } from "@/lib/types";
import { createMetricsSignal } from "./create-metrics-signal";

export const globalCpu = createMetricsSignal<GlobalCpu>(TauriCommand.GlobalCpu);
export const memory = createMetricsSignal<Memory>(TauriCommand.Memory);
export const swap = createMetricsSignal<Memory>(TauriCommand.Swap);
