import { Command, KillProcessOpts, KillProcessResult } from "@/lib/types";
import { invoke } from "@/lib/helpers";

const killProcess = (opts: KillProcessOpts): Promise<KillProcessResult> => invoke(Command.KillProcess, opts);
const showInFolder = (path: string): Promise<void> => invoke(Command.ShowInFolder, { path });

export const commands = {
  killProcess,
  showInFolder,
};
