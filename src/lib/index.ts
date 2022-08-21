import { invoke as invokeTauri } from "@tauri-apps/api/tauri";
import { TauriCommand } from "@/lib/types";

const invoke = (cmd: TauriCommand) => invokeTauri(cmd);

export { invoke, TauriCommand };
