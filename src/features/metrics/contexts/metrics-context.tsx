import useRequestMetrics from "@/features/metrics/hooks/useRequestMetrics";
import { GlobalCpu, Memory, Network, Swap, TauriCommand } from "@/lib/types";
import { createContext } from "react";

interface MetricsProviderProps {
  children: React.ReactNode;
}
interface MetricsContext {
  globalCpu: GlobalCpu[];
  memory: Memory[];
  swap: Swap[];
  network: Network[][];
}

export const MetricsContext = createContext<MetricsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  network: [],
});

const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [globalCpu] = useRequestMetrics<GlobalCpu>(TauriCommand.GlobalCpu);
  const [memory] = useRequestMetrics<Memory>(TauriCommand.Memory);
  const [swap] = useRequestMetrics<Swap>(TauriCommand.Swap);
  const [network] = useRequestMetrics<Network[]>(TauriCommand.Networks);

  return (
    <MetricsContext.Provider
      value={{
        globalCpu,
        memory,
        swap,
        network,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
