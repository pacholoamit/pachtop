import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import logger from "../../../lib/logger";
import { memory } from "../signals";
import { useEffect } from "react";
interface MemoryChartProps extends ChartProps {}

const MemoryChart: React.FC<MemoryChartProps> = ({ xAxisMin }) => {
  const title = "Random Access Memory (RAM)";
  const labels = memory.value.map((mem) => mem.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `RAM Used (${memory.value.slice(-1)[0]?.unit})`,
      data: memory.value.map((mem) => ({ x: mem.timestamp, y: mem.used })),
      backgroundColor: "rgba(10, 167, 147, 0.45)",
      borderColor: "rgba(10, 167, 147, 1)",
      fill: true,
      yAxisId: "ram-usage",
    },
  ];
  useEffect(() => {
    const createLogger = async () => {
      return (await logger).info("memory-chart.tsx");
    };

    createLogger();
  }, []);
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
