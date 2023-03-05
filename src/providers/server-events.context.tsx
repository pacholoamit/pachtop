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
  const [sysInfo, pushSysinfo] = useLimitedArray<SysInfo>(10);
  const [globalCpu, pushGlobalCpu] = useLimitedArray<GlobalCpu>(10);
  const [memory, pushMemory] = useLimitedArray<Memory>(10);
  const [swap, pushSwap] = useLimitedArray<Swap>(10);
  const [processes, pushProcesses] = useLimitedArray<Process>(10);
  // const [networks] = useState<UniqueNetwork[]>([]);
  // const [cpus] = useState<UniqueCpu[]>([]);
  // const [disks] = useState<UniqueDisk[]>([]);

  useEffect(() => {
    listen<SysInfo>(ServerEvent.SysInfo, (data) => pushSysinfo(data.payload));
    listen<GlobalCpu>(ServerEvent.GlobalCpu, (data) => pushGlobalCpu(data.payload));
    listen<Memory>(ServerEvent.Memory, (data) => pushMemory(data.payload));
    listen<Swap>(ServerEvent.Swap, (data) => pushSwap(data.payload));
    listen<Process>(ServerEvent.Processes, (data) => pushProcesses(data.payload));
    // listen<Cpu[]>(ServerEvent.Cpus, (data) => console.log(data));
    // listen<Network>(ServerEvent.Networks, (data) => console.log(data));
    // listen<Disk>(ServerEvent.Disks, (data) => console.log(data));
  }, []);

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
