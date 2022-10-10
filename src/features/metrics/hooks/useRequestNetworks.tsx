import useRequestMetrics from "@/features/metrics/hooks/useRequestMetrics";
import { UniqueNetwork } from "@/features/metrics/utils/types";
import { TauriCommand } from "@/lib";
import { Network } from "@/lib/types";
import { useEffect, useState } from "react";

const useRequestNetworks = () => {
  const [networks] = useRequestMetrics<Network[]>(TauriCommand.Networks);
  const [uniqueNetworks, setUniqueNetworks] = useState<UniqueNetwork[]>([]);

  useEffect(() => {
    networks.at(-1)?.filter((network) => {
      // If the network name is not in the uniqueNetworks array, add it
      if (!uniqueNetworks.find((unique) => unique.name === network.name)) {
        uniqueNetworks.push({
          name: network.name,
          data: [network],
        });
      }
      // If the network name is in the uniqueNetworks array, update the data
      const index = uniqueNetworks.findIndex((u) => u.name === network.name);
      uniqueNetworks[index].data.push(network);
    });
  }, [networks]);

  return [uniqueNetworks];
};

export default useRequestNetworks;
