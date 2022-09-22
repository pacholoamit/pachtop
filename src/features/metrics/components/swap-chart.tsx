import AreaChart, { DatasetOptions } from "@/components/area-chart";
import useGetMetrics from "@/hooks/useGetMetrics";
import { TauriCommand } from "@/lib";
import { Swap } from "@/lib/types";
import { ChartProps } from "@/features/metrics/utils/types";

interface SwapChartProps extends ChartProps {}

const SwapChart: React.FC<SwapChartProps> = ({ xAxisMin }) => {
  const [swap] = useGetMetrics<Swap>(TauriCommand.Swap);
  const title = "Swap Memory";
  const labels = swap.map((mem) => mem.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `Swap Memory Used (${swap.slice(-1)[0]?.unit})`,
      data: swap.map((mem) => ({ x: mem.timestamp, y: mem.used })),
      backgroundColor: "rgba(53, 162, 235, 0.45)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "swap-usage",
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

export default SwapChart;
