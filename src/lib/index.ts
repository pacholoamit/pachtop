import { invoke as invokeTauri, InvokeArgs } from "@tauri-apps/api/tauri";
import { Command } from "@/lib/types";

const invoke = <T extends InvokeArgs, V = any>(cmd: Command, args?: T) => invokeTauri(cmd, args) as Promise<V>;

export { invoke, Command };
