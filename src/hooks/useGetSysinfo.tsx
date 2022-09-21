import { useEffect, useState } from "react";
import { GlobalCpu, SysInfo, TauriCommand } from "@/lib/types";
import { invoke } from "@/lib";

const useGetSysinfo = () => {
  const [sysInfo, setSysInfo] = useState<SysInfo | null>();
  const [globalCpu, setGlobalCpu] = useState<GlobalCpu | null>();

  useEffect(() => {
    const requestSysinfo = async () => {
      const sysinfo = (await invoke(TauriCommand.SysInfo)) as SysInfo;
      const globalCpu = (await invoke(TauriCommand.GlobalCpu)) as GlobalCpu;
      setSysInfo((_) => sysinfo);
      setGlobalCpu((_) => globalCpu);
    };

    requestSysinfo();
  }, []);

  return {
    sysInfo,
    globalCpu,
  };
};

export default useGetSysinfo;
