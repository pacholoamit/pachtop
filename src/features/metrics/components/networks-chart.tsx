import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import { networks } from "@/features/metrics/signals";

interface NetworksChartProps extends ChartProps {}

const NetworksChart: React.FC<NetworksChartProps> = ({ xAxisMin }) => {
  const title = "Network Received";
  const labels = networks.value.map((network) => network.data[0].timestamp);
  const datasets: DatasetOptions[] = networks.value.map((network) => ({
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
