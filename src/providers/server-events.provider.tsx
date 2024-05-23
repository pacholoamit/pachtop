import { createContext } from "react";

import { VIEWABLE_ELEMENT_COUNT } from "@/contants";
import useServerEventsEnumerableStore, { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import useServerEventsStore from "@/hooks/useServerEventsStore";
import { Cpu, GlobalCpu, Memory, Network, Process, ServerEvent, Swap } from "@/lib/types";

interface ServerEventsProviderProps {
  children: React.ReactNode;
}

interface ServerEventsContext {
  memory: Memory[];
  swap: Swap[];
  networks: Enumerable<Network>[];
}

export const ServerEventsContext = createContext<ServerEventsContext>({
  memory: [],
  swap: [],
  networks: [],
});

const maxSize = VIEWABLE_ELEMENT_COUNT;

const ServerEventsProvider: React.FC<ServerEventsProviderProps> = ({ children }) => {
  const [memory] = useServerEventsStore<Memory>(ServerEvent.Memory, { maxSize });
  const [swap] = useServerEventsStore<Swap>(ServerEvent.Swap, { maxSize });
  const [networks] = useServerEventsEnumerableStore<Network>(ServerEvent.Networks, { maxSize });

  return (
    <ServerEventsContext.Provider
      value={{
        memory,
        swap,
        networks,
      }}
    >
      {children}
    </ServerEventsContext.Provider>
  );
};

export default ServerEventsProvider;
