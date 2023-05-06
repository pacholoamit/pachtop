import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import useServerEventsContext from "@/hooks/useServerEventsContext";

const SwapAreaChart: React.FC = ({}) => {
  const { swap } = useServerEventsContext();
  const title = "Swap Memory";
  const labels = swap.map((swap) => swap.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `Swap Memory Usage`,
      data: swap.map((swap) => ({ x: swap.timestamp, y: swap.used })),
      backgroundColor: "rgba(53, 162, 235, 0.45)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "swap-usage",
    },
  ];
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
        datasets={datasets}
        callbacks={callbacks}
        yAxisTicksCallback={yAxisTicksCallback}
      />
    </Card>
  );
};

export default SwapAreaChart;
