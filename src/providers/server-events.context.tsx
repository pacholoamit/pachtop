import { useEffect, createContext, useState } from "react";
import { Cpu, Disk, GlobalCpu, Memory, Network, Process, ServerEvent, Swap, SysInfo } from "@/lib/types";
import { VIEWABLE_ELEMENT_COUNT } from "@/contants";
import useServerEventsStore from "@/hooks/useServerEventsStore";

interface ServerEventsProviderProps {
  children: React.ReactNode;
}

interface ServerEventsContext {
  globalCpu: GlobalCpu[];
  memory: Memory[];
  swap: Swap[];
  sysInfo: SysInfo | null;
  processes: Process[];
  // networks: UniqueNetwork[];
  // cpus: UniqueCpu[];
  // disks: UniqueDisk[];
}

export const ServerEventsContext = createContext<ServerEventsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  sysInfo: null,
  processes: [],
  // networks: [],
  // cpus: [],
  // disks: [],
});

const maxSize = VIEWABLE_ELEMENT_COUNT;

const ServerEventsProvider: React.FC<ServerEventsProviderProps> = ({ children }) => {
  const [sysInfo] = useServerEventsStore<SysInfo>(ServerEvent.SysInfo, { maxSize });
  const [globalCpu] = useServerEventsStore<GlobalCpu>(ServerEvent.GlobalCpu, { maxSize });
  const [memory] = useServerEventsStore<Memory>(ServerEvent.Memory, { maxSize });
  const [swap] = useServerEventsStore<Swap>(ServerEvent.Swap, { maxSize });
  const [processes] = useServerEventsStore<Process>(ServerEvent.Processes, { maxSize });
  // const [networks] = useState<UniqueNetwork[]>([]);
  // const [cpus] = useState<UniqueCpu[]>([]);
  // const [disks] = useState<UniqueDisk[]>([]);

  // listen<Cpu[]>(ServerEvent.Cpus, (data) => console.log(data));
  // listen<Network>(ServerEvent.Networks, (data) => console.log(data));
  // listen<Disk>(ServerEvent.Disks, (data) => console.log(data));

  return (
    <ServerEventsContext.Provider
      value={{
        sysInfo: sysInfo[sysInfo.length - 1] ?? null,
        globalCpu,
        memory,
        swap,
        processes,
        // networks,
        // cpus,
        // disks,
      }}
    >
      {children}
    </ServerEventsContext.Provider>
  );
};

export default ServerEventsProvider;
