import useRequestMetrics from "@/features/metrics/hooks/useRequestMetrics";
import { Disk, Command } from "@/lib/types";
import { useEffect, useState } from "react";
import { UniqueDisk } from "@/features/metrics/utils/types";

const useRequestDisks = () => {
  const [disks] = useRequestMetrics<Disk[]>(Command.Disks);
  const [uniqueDisks, setUniqueDisks] = useState<UniqueDisk[]>([]);

  useEffect(() => {
    disks.at(-1)?.filter((disk) => {
      // If the disk name is not in the uniqueDisks array, add it
      if (!uniqueDisks.find((unique) => unique.id === disk.name)) {
        uniqueDisks.push({
          id: disk.name,
          data: [disk],
        });
      }
      // If the disk name is in the uniqueDisks array, update the data
      const index = uniqueDisks.findIndex((u) => u.id === disk.name);
      uniqueDisks[index].data.push(disk);
    });
  }, [disks]);

  return [uniqueDisks];
};

export default useRequestDisks;
