import Card from "@/components/card";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import useServerEventsContext from "@/hooks/useServerEventsContext";

interface GlobalCpuAreaChartProps extends ChartProps {}

const GlobalCpuAreaChart: React.FC<GlobalCpuAreaChartProps> = ({ xAxisMin }) => {
  const { globalCpu } = useServerEventsContext();

  const title = "CPU Usage";
  const labels = globalCpu.map((cpu) => cpu.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `CPU Usage`,
      data: globalCpu.map((cpu) => ({
        x: cpu.timestamp,
        y: cpu.usage,
      })),
      backgroundColor: "rgba(255, 99, 132, 0.45)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "global-cpu-usage",
    },
  ];

  const callbacks = {
    label: (context: any) => {
      const label = context.dataset.label || "";
      const value = context.parsed.y.toFixed(2);
      return `${label}: ${value}%`;
    },
  };
  const yAxisTicksCallback = (value: number) => value + "%";
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

export default GlobalCpuAreaChart;
