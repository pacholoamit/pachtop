import Card from "@/components/card";

import useServerEventsContext from "@/hooks/useServerEventsContext";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";

interface NetworksAreaChartProps extends ChartProps {}

const NetworksAreaChart: React.FC<NetworksAreaChartProps> = ({ xAxisMin }) => {
  const { networks } = useServerEventsContext();
  const title = "Network Received";
  const labels = networks?.map((network) => network.data[0].timestamp);
  const datasets: DatasetOptions[] = networks?.map((network) => ({
    label: network.id,
    data: network.data.map((data) => ({
      x: data.timestamp,
      y: data.received,
    })),
    backgroundColor: "rgba(255,215,120,0.4)",
    borderColor: "rgba(255,215,120,1)",
    fill: true,
    yAxisId: "network-received",
  }));
  const callbacks = {
    label: (context: any) => {
      const label = context.dataset.label || "";
      const value = formatBytes(context.parsed.y);
      return `${label}: ${value}`;
    },
  };

  const yAxisTicksCallback = (value: number) => formatBytes(value);

  return (
    <Card style={{ height: "300px" }}>
      <AreaChart
        title={title}
        labels={labels}
        xAxisMin={xAxisMin}
        datasets={datasets}
        callbacks={callbacks}
        yAxisTicksCallback={yAxisTicksCallback}
      />
    </Card>
  );
};

export default NetworksAreaChart;
