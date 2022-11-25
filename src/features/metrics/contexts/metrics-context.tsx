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
  sysInfo: SysInfo[];
  networks: UniqueNetwork[];
  cpus: UniqueCpu[];
  disks: UniqueDisk[];
  processes: Process[];
}

export const MetricsContext = createContext<MetricsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  sysInfo: [],
  networks: [],
  cpus: [],
  disks: [],
  processes: [],
});

const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [globalCpu] = useRequestMetrics<GlobalCpu>(TauriCommand.GlobalCpu);
  const [memory] = useRequestMetrics<Memory>(TauriCommand.Memory);
  const [swap] = useRequestMetrics<Swap>(TauriCommand.Swap);
  const [sysInfo] = useRequestMetrics<SysInfo>(TauriCommand.SysInfo);
  const [processes] = useRequestMetrics<Process>(TauriCommand.Processes);
  const [networks] = useRequestNetworks();
  const [cpus] = useRequestCpus();
  const [disks] = useRequestDisks();

  return (
    <MetricsContext.Provider
      value={{
        globalCpu,
        memory,
        swap,
        sysInfo,
        networks,
        cpus,
        disks,
        processes,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
