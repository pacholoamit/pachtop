import { invoke } from "@/lib/helpers";
import {
  Command,
  DiskAnalysisProgress,
  DiskItem,
  DiskScanInput,
  KillProcessOpts,
  KillProcessResult,
  ScanOpts,
  ServerEvent,
} from "@/lib/types";
import { listen } from "@tauri-apps/api/event";

// TODO: Fix types
export const commands = {
  killProcess: (opts: KillProcessOpts): Promise<KillProcessResult> => invoke(Command.KillProcess, opts as any),
  open: (path: string): Promise<void> => invoke(Command.Open, { path }),
  showInTerminal: (path: string): Promise<void> => invoke(Command.ShowInTerminal, { path }),
  deleteFile: (path: string): Promise<void> => invoke(Command.DeleteFile, { path }),
  deleteFolder: (path: string): Promise<void> => invoke(Command.DeleteFolder, { path }),
  scan: (callback: (progress: DiskAnalysisProgress) => void, input: DiskScanInput): Promise<DiskItem> => {
    listen<DiskAnalysisProgress>(ServerEvent.DiskAnalysisProgress, ({ payload }) => callback(payload));
    return invoke(Command.DiskScan, { input });
  },
  disk_analysis_flattened: (path: ScanOpts): Promise<DiskItem[]> => invoke(Command.DiskAnalysisFlattened, path as any),
  add_pachtop_exclusion: (): Promise<void> => invoke(Command.AddPachtopExclusion, {}),
};
