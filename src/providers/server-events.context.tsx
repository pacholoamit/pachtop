import { listen } from "@tauri-apps/api/event";
import { useEffect, createContext, useState } from "react";
import { Cpu, Disk, GlobalCpu, Memory, Network, Process, ServerEvent, Swap, SysInfo } from "@/lib/types";
import useLimitedArray from "@/hooks/useLimitedArray";

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

const ServerEventsProvider: React.FC<ServerEventsProviderProps> = ({ children }) => {
  const [sysInfo, pushSysinfo] = useLimitedArray<SysInfo>(100);
  const [globalCpu, pushGlobalCpu] = useLimitedArray<GlobalCpu>(100);
  const [memory, pushMemory] = useLimitedArray<Memory>(100);
  const [swap, pushSwap] = useLimitedArray<Swap>(100);
  const [processes, pushProcesses] = useLimitedArray<Process>(100);
  // const [networks] = useState<UniqueNetwork[]>([]);
  // const [cpus] = useState<UniqueCpu[]>([]);
  // const [disks] = useState<UniqueDisk[]>([]);

  listen<SysInfo>(ServerEvent.SysInfo, ({ payload }) => pushSysinfo(payload));
  listen<GlobalCpu>(ServerEvent.GlobalCpu, ({ payload }) => pushGlobalCpu(payload));
  listen<Memory>(ServerEvent.Memory, ({ payload }) => pushMemory(payload));
  listen<Swap>(ServerEvent.Swap, ({ payload }) => pushSwap(payload));
  listen<Process>(ServerEvent.Processes, ({ payload }) => pushProcesses(payload));
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
