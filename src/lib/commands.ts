import { invoke } from "@/lib/helpers";
import { Command, DeepScanOpts, DiskItem, KillProcessOpts, KillProcessResult } from "@/lib/types";

const killProcess = (opts: KillProcessOpts): Promise<KillProcessResult> => invoke(Command.KillProcess, opts);
const showInFolder = (path: string): Promise<void> => invoke(Command.ShowInFolder, { path });
const deepScan = (path: DeepScanOpts): Promise<DiskItem> => invoke(Command.DeepScan, path);
const deepScanEmit = (path: DeepScanOpts): Promise<DiskItem> => invoke(Command.DeepScanEmit, path);

export const commands = {
  killProcess,
  showInFolder,
  deepScan,
  deepScanEmit,
};
