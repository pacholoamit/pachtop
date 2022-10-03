import useRequestMetrics from "@/hooks/useRequestMetrics";
import useRequestNetworks from "@/features/metrics/hooks/useRequestNetworks";
import useRequestCpus from "@/features/metrics/hooks/useRequestCpus";

import { UniqueCpu, UniqueNetwork } from "@/features/metrics/utils/types";
import { createContext } from "react";
import {
  Disk,
  GlobalCpu,
  Memory,
  Swap,
  SysInfo,
  TauriCommand,
} from "@/lib/types";

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
  disks: Disk[];
}

export const MetricsContext = createContext<MetricsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  sysInfo: [],
  networks: [],
  cpus: [],
  disks: [],
});

const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [globalCpu] = useRequestMetrics<GlobalCpu>(TauriCommand.GlobalCpu);
  const [memory] = useRequestMetrics<Memory>(TauriCommand.Memory);
  const [swap] = useRequestMetrics<Swap>(TauriCommand.Swap);
  const [networks] = useRequestNetworks();
  const [sysInfo] = useRequestMetrics<SysInfo>(TauriCommand.SysInfo);
  const [cpus] = useRequestCpus();

  const [disks] = useRequestMetrics<Disk>(TauriCommand.Disks); //  Move this to features/disks

  console.log(disks.at(-1));
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
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
