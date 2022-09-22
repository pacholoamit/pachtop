import AreaChart, { DatasetOptions } from "@/components/area-chart";
import useGetMetrics from "@/hooks/useGetMetrics";
import { TauriCommand } from "@/lib";
import { Network } from "@/lib/types";
import { ChartProps } from "@/features/metrics/utils/types";
import { useState, useEffect } from "react";

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

const NetworksChart: React.FC<NetworksChartProps> = ({ xAxisMin }) => {
  const [networks] = useGetMetrics<Network[]>(TauriCommand.Networks);
  const [uniqueNetworks, setUniqueNetworks] = useState<UniqueNetwork[]>([]);
  const title = "Network Received";
  const labels = uniqueNetworks.map((network) => network.data[0].timestamp);

  const datasets: DatasetOptions[] = uniqueNetworks.map((network) => ({
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

  useEffect(() => {
    networks.at(-1)?.filter((network) => {
      if (!uniqueNetworks.some((n) => n?.name === network.name)) {
        setUniqueNetworks((prev) => [
          ...prev,
          {
            name: network.name,
            unit: network.unit,
            data: [
              {
                received: network.received,
                timestamp: network.timestamp,
              },
            ],
          },
        ]);
      } else {
        const i = uniqueNetworks.findIndex((n) => n?.name === network.name);
        setUniqueNetworks((prev) => {
          prev[i].data.push({
            timestamp: network.timestamp,
            received: network.received,
          });
          return prev;
        });
      }
    });
  }, [networks]);

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
