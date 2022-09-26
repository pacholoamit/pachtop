import { computed, ReadonlySignal } from "@preact/signals-react";
import { TauriCommand } from "@/lib";
import { Network } from "@/lib/types";
import { createMetricsSignal } from "@/features/metrics/signals/create-metrics-signal";

interface UniqueNetwork {
  name: string;
  unit: string;
  data: UniqueNetworkData[];
}

interface UniqueNetworkData {
  received: number;
  timestamp: number;
}

const createNetworkSignal = (): ReadonlySignal<UniqueNetwork[]> => {
  const networks = createMetricsSignal<Network[]>(TauriCommand.Networks);
  const uniqueNetworks: UniqueNetwork[] = [];

  return computed(() => {
    networks.value.at(-1)?.filter((network) => {
      // If the network name is not in the uniqueNetworks array, add it
      if (!uniqueNetworks.find((unique) => unique.name === network.name)) {
        uniqueNetworks.push({
          name: network.name,
          unit: network.unit,
          data: [{ received: network.received, timestamp: network.timestamp }],
        });
      }
      // If the network name is in the uniqueNetworks array, update the data
      const index = uniqueNetworks.findIndex((u) => u.name === network.name);
      uniqueNetworks[index].data.push({
        received: network.received,
        timestamp: network.timestamp,
      });
    });
    return uniqueNetworks;
  });
};

export default createNetworkSignal;
