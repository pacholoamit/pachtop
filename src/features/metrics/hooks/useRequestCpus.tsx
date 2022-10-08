import useRequestMetrics from "@/features/metrics/hooks/useRequestMetrics";
import { UniqueCpu } from "@/features/metrics/utils/types";
import { TauriCommand } from "@/lib";
import { Cpu } from "@/lib/types";
import { useEffect, useState } from "react";

const useRequestCpus = () => {
  const [cpus] = useRequestMetrics<Cpu[]>(TauriCommand.Cpus);
  const [uniqueCpus, setUniqueCpus] = useState<UniqueCpu[]>([]);

  useEffect(() => {
    cpus.at(-1)?.filter((cpu) => {
      // If the cpu name is not in the uniqueCpus array, add it
      if (!uniqueCpus.find((unique) => unique.name === cpu.name)) {
        uniqueCpus.push({
          name: cpu.name,
          data: [cpu],
        });
      }
      // If the cpu name is in the uniqueCpus array, update the data
      const index = uniqueCpus.findIndex((u) => u.name === cpu.name);
      uniqueCpus[index].data.push(cpu);
    });
  }, [cpus]);

  return [uniqueCpus];
};

export default useRequestCpus;
