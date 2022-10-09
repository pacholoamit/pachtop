import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";

interface SwapAreaChartProps extends ChartProps {}

const SwapAreaChart: React.FC<SwapAreaChartProps> = ({ xAxisMin }) => {
  const { swap } = useMetricsContext();
  const title = "Swap Memory";
  const labels = swap.map((swap) => swap.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `Swap Memory`,
      data: swap.map((swap) => ({ x: swap.timestamp, y: swap.used })),
      backgroundColor: "rgba(53, 162, 235, 0.45)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "swap-usage",
    },
  ];
  return (
    <>
      <AreaChart
        title={title}
        labels={labels}
        xAxisMin={xAxisMin}
        datasets={datasets}
      />
    </>
  );
};

export default SwapAreaChart;
