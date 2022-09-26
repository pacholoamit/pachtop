import AreaChart, { DatasetOptions } from "@/components/area-chart";
import useGetMetrics from "@/hooks/useGetMetrics";
import { TauriCommand } from "@/lib";
import { Network } from "@/lib/types";
import { ChartProps } from "@/features/metrics/utils/types";
import { useState, useEffect } from "react";
import { computed, effect, signal } from "@preact/signals-react";
import { networks } from "@/features/metrics/signals";

interface NetworksChartProps extends ChartProps {}

interface UniqueNetwork {
  name: string;
  unit: string;
  data: UniqueNetworkData[];
}

interface UniqueNetworkData {
  received: number;
  timestamp: number;
}

const uniqueNetworks: UniqueNetwork[] = [];

const net = computed(() => {
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

const NetworksChart: React.FC<NetworksChartProps> = ({ xAxisMin }) => {
  const title = "Network Received";
  const labels = net.value.map((network) => network.data[0].timestamp);
  const datasets: DatasetOptions[] = net.value.map((network) => ({
    label: `${network.name} (${network.unit})`,
    data: network.data.map((data) => ({
      x: data.timestamp,
      y: data.received,
    })),
    backgroundColor: "rgba(255,215,120,0.4)",
    borderColor: "rgba(255,215,120,1)",
    fill: true,
    yAxisId: "network-received",
  }));

  return (
    <AreaChart
      title={title}
      labels={labels}
      xAxisMin={xAxisMin}
      datasets={datasets}
    />
  );
};

export default NetworksChart;
