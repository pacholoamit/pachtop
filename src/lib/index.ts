import { invoke as invokeTauri, InvokeArgs } from "@tauri-apps/api/tauri";
import { TauriCommand } from "@/lib/types";

const invoke = <T extends InvokeArgs>(cmd: TauriCommand, args?: T) => invokeTauri(cmd, args);

export { invoke, TauriCommand };
