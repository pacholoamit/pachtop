import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";

interface MemoryAreaChartProps extends ChartProps {}

const MemoryAreaChart: React.FC<MemoryAreaChartProps> = ({ xAxisMin }) => {
  const { memory } = useMetricsContext();

  const title = "Random Access Memory (RAM)";
  const labels = memory.map((mem) => mem.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `RAM Used (${memory.slice(-1)[0]?.unit})`,
      data: memory.map((mem) => ({ x: mem.timestamp, y: mem.used })),
      backgroundColor: "rgba(10, 167, 147, 0.45)",
      borderColor: "rgba(10, 167, 147, 1)",
      fill: true,
      yAxisId: "ram-usage",
    },
  ];
  return (
    <AreaChart
      title={title}
      labels={labels}
      xAxisMin={xAxisMin}
      datasets={datasets}
    />
  );
};

export default MemoryAreaChart;
