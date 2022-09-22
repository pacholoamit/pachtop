import AreaChart, { DatasetOptions } from "@/components/area-chart";
import useGetMetrics from "@/hooks/useGetMetrics";
import { TauriCommand } from "@/lib";
import { Memory } from "@/lib/types";
import { ChartProps } from "@/features/metrics/utils/types";

interface MemoryChartProps extends ChartProps {}

const MemoryChart: React.FC<MemoryChartProps> = ({
  xAxisMin,
}: MemoryChartProps) => {
  const [memory] = useGetMetrics<Memory>(TauriCommand.Memory);
  const title = "Random Access Memory (RAM)";
  const labels = memory.map((mem) => mem.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `Ram Used (${memory.slice(-1)[0]?.unit})`,
      data: memory.map((mem) => ({ x: mem.timestamp, y: mem.used })),
      backgroundColor: "rgba(10, 167, 147, 0.45)",
      borderColor: "rgba(10, 167, 147, 1)",
      fill: true,
      yAxisId: "ram-used",
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

export default MemoryChart;
