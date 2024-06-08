import { useCallback } from "react";

import { commands } from "@/lib";
import notification from "@/utils/notification";

interface UseKillProcessOpts {
  onKill?: () => void;
  onFailure?: () => void;
}

const killProcess = async (name: string, onKill?: () => void, onFailure?: () => void) => {
  const isKilled = await commands.killProcess({ name });

  if (!isKilled) {
    onFailure?.();
    notification.error({
      title: "Failed to Kill Process",
      message: `Failed to kill process ${name}`,
    });
    return;
  }
  onKill?.();
  notification.success({
    title: "Process Killed",
    message: `Process ${name} was killed successfully`,
  });
};

const useKillProcess = (opts: UseKillProcessOpts) => {
  const { onKill, onFailure } = opts;

  return useCallback((name: string) => killProcess(name, onKill, onFailure), [onKill, onFailure]);
};

export default useKillProcess;
