import formatBytes from "@/features/metrics/utils/format-bytes";
import { ChartProps, UniqueDisk } from "@/features/metrics/utils/types";
import AreaChart, { DatasetOptions } from "@/components/area-chart";

interface DiskAreaChartProps extends ChartProps {
  disk: UniqueDisk;
}

const DiskAreaChart: React.FC<DiskAreaChartProps> = ({ xAxisMin, disk }) => {
  const labels = disk.data.map((data) => data.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: disk.id + " (Used)",
      data: disk.data.map((data) => ({
        x: data.timestamp,
        y: data.used,
      })),
      backgroundColor: "rgba(255,215,120,0.4)",
      borderColor: "rgba(255,215,120,1)",
      fill: true,
      yAxisId: "disk-used",
    },
    {
      label: disk.id + " (Free)",
      data: disk.data.map((data) => ({
        x: data.timestamp,
        y: data.free,
      })),
      backgroundColor: "rgba(10, 167, 147, 0.45)",
      borderColor: "rgba(10, 167, 147, 1)",
      fill: true,
      yAxisId: "disk-free",
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
    <AreaChart
      labels={labels}
      title={disk.id}
      datasets={datasets}
      callbacks={callbacks}
      yAxisTicksCallback={yAxisTicksCallback}
      stacked={true}
      xAxisMin={xAxisMin}
    />
  );
};

export default DiskAreaChart;
