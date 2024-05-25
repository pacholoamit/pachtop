import { invoke } from "@/lib/helpers";
import { Command, DeepScanOpts, DiskItem, KillProcessOpts, KillProcessResult } from "@/lib/types";

export const commands = {
  killProcess: (opts: KillProcessOpts): Promise<KillProcessResult> => invoke(Command.KillProcess, opts),
  showInFolder: (path: string): Promise<void> => invoke(Command.ShowInFolder, { path }),
  disk_analysis: (path: DeepScanOpts): Promise<DiskItem> => invoke(Command.DiskAnalysis, path),
  disk_analysis_flattened: (path: DeepScanOpts): Promise<DiskItem[]> => invoke(Command.DiskAnalysisFlattened, path),
};
