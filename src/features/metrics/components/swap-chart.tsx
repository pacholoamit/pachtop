import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import { swap } from "@/features/metrics/signals";

interface SwapChartProps extends ChartProps {}

const SwapChart: React.FC<SwapChartProps> = ({ xAxisMin }) => {
  const title = "Swap Memory";
  const labels = swap.value.map((swap) => swap.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `Swap Memory Used (${swap.value.slice(-1)[0]?.unit})`,
      data: swap.value.map((swap) => ({ x: swap.timestamp, y: swap.used })),
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
