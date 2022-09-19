import { useEffect, useState } from "react";
import { SysInfo, TauriCommand } from "@/lib/types";
import { invoke } from "@/lib";

const useGetSysinfo = () => {
  const [sysInfo, setSysInfo] = useState<SysInfo | null>();

  useEffect(() => {
    const requestSysinfo = async () => {
      const sysinfo = (await invoke(TauriCommand.SysInfo)) as SysInfo;
      setSysInfo((_) => sysinfo);
    };

    requestSysinfo();
  }, []);

  return {
    sysInfo,
  };
};

export default useGetSysinfo;
