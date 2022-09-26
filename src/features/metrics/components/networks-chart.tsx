import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";

interface NetworksChartProps extends ChartProps {}

const NetworksChart: React.FC<NetworksChartProps> = ({ xAxisMin }) => {
  const { networks } = useMetricsContext();
  const title = "Network Received";
  const labels = networks.map((network) => network.data[0].timestamp);
  const datasets: DatasetOptions[] = networks.map((network) => ({
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
