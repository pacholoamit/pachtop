import { invoke } from "@/lib/helpers";
import { Command, DiskItem, KillProcessOpts, KillProcessResult, ScanOpts } from "@/lib/types";

export const commands = {
  killProcess: (opts: KillProcessOpts): Promise<KillProcessResult> => invoke(Command.KillProcess, opts),
  showInFolder: (path: string): Promise<void> => invoke(Command.ShowInFolder, { path }),
  turboScan: (path: ScanOpts): Promise<DiskItem> => invoke(Command.DiskTurboScan, path),
  scan: (path: ScanOpts): Promise<DiskItem> => invoke(Command.DiskScan, path),
  disk_analysis_flattened: (path: ScanOpts): Promise<DiskItem[]> => invoke(Command.DiskAnalysisFlattened, path),
};
