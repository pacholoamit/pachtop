import { Command, invoke } from "@/lib";
import { Process } from "@/lib/types";
import { useEffect, useState } from "react";

const useProcesses = (query?: string) => {
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    const requestProcesses = async () => {
      const data = (await invoke(Command.Processes)) as Process[];
      setProcesses(data);
    };

    const timer = setInterval(requestProcesses, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    processes,
    setProcesses,
  };
};

export default useProcesses;
