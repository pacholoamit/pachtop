import { Command, invoke } from "@/lib";
import { KillProcessOpts, Process } from "@/lib";
import notification from "@/utils/notification";
import { useCallback } from "react";

interface UseKillProcessOpts {
  onKill?: () => void;
  onFailure?: () => void;
}

const killProcess = async (process: Process, onKill?: () => void, onFailure?: () => void) => {
  const cmd = Command.KillProcess;
  const isKilled = await invoke<KillProcessOpts, boolean>(cmd, {
    pid: process.pid,
  });

  if (!isKilled) {
    onFailure?.();
    notification.error({
      title: "Error ❌",
      message: `Failed to kill process ${process.pid}`,
    });
    return;
  }
  onKill?.();
  notification.success({
    title: "Process Killed ✅",
    message: `Process ${process.name} was killed successfully`,
  });
};

const useKillProcess = (opts: UseKillProcessOpts) => {
  const { onKill, onFailure } = opts;

  const kill = useCallback((process: Process) => killProcess(process, onKill, onFailure), [onKill, onFailure]);

  return [kill] as const;
};

export default useKillProcess;
