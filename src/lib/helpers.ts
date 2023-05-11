import { invoke as invokeTauri, InvokeArgs } from "@tauri-apps/api/tauri";
import { Command } from "@/lib/types";

export const invoke = <T extends InvokeArgs, V = any>(cmd: Command, args?: T) => invokeTauri(cmd, args) as Promise<V>;
