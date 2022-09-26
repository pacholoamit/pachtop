import useRequestMetrics from "@/features/metrics/hooks/useRequestMetrics";
import useRequestNetworks from "@/features/metrics/hooks/useRequestNetworks";
import { GlobalCpu, Memory, Swap, SysInfo, TauriCommand } from "@/lib/types";
import { UniqueNetwork } from "@/features/metrics/utils/types";
import { createContext } from "react";

interface MetricsProviderProps {
  children: React.ReactNode;
}
interface MetricsContext {
  globalCpu: GlobalCpu[];
  memory: Memory[];
  swap: Swap[];
  sysInfo: SysInfo[];
  networks: UniqueNetwork[];
}

export const MetricsContext = createContext<MetricsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  sysInfo: [],
  networks: [],
});

const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [globalCpu] = useRequestMetrics<GlobalCpu>(TauriCommand.GlobalCpu);
  const [memory] = useRequestMetrics<Memory>(TauriCommand.Memory);
  const [swap] = useRequestMetrics<Swap>(TauriCommand.Swap);
  const [networks] = useRequestNetworks();
  const [sysInfo] = useRequestMetrics<SysInfo>(TauriCommand.SysInfo);

  return (
    <MetricsContext.Provider
      value={{
        globalCpu,
        memory,
        swap,
        sysInfo,
        networks,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
