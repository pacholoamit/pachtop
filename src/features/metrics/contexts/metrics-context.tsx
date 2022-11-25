import useRequestMetrics from "@/features/metrics/hooks/useRequestMetrics";
import useRequestNetworks from "@/features/metrics/hooks/useRequestNetworks";
import useRequestCpus from "@/features/metrics/hooks/useRequestCpus";
import useRequestDisks from "@/features/metrics/hooks/useRequestDisks";
import { createContext } from "react";
import {
  GlobalCpu,
  Memory,
  Process,
  Swap,
  SysInfo,
  TauriCommand,
} from "@/lib/types";
import {
  UniqueCpu,
  UniqueDisk,
  UniqueNetwork,
} from "@/features/metrics/utils/types";

interface MetricsProviderProps {
  children: React.ReactNode;
}
interface MetricsContext {
  globalCpu: GlobalCpu[];
  memory: Memory[];
  swap: Swap[];
  networks: UniqueNetwork[];
  cpus: UniqueCpu[];
  disks: UniqueDisk[];
  sysInfo: SysInfo | null;
  processes: Process[];
}

export const MetricsContext = createContext<MetricsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  networks: [],
  cpus: [],
  disks: [],
  sysInfo: null,
  processes: [],
});

const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [globalCpu] = useRequestMetrics<GlobalCpu>(TauriCommand.GlobalCpu);
  const [memory] = useRequestMetrics<Memory>(TauriCommand.Memory);
  const [swap] = useRequestMetrics<Swap>(TauriCommand.Swap);
  const [networks] = useRequestNetworks();
  const [cpus] = useRequestCpus();
  const [disks] = useRequestDisks();
  const [sysInfo] = useRequestMetrics<SysInfo>(TauriCommand.SysInfo, {
    latestOnly: true,
  });
  const [processes] = useRequestMetrics<Process[]>(TauriCommand.Processes, {
    latestOnly: true,
  });

  return (
    <MetricsContext.Provider
      value={{
        globalCpu,
        memory,
        swap,
        sysInfo: sysInfo.at(-1) ?? null,
        networks,
        cpus,
        disks,
        processes: processes.at(-1) ?? [],
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
