import formatBytes from "@/features/metrics/utils/format-bytes";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk } from "@/lib/types";
import AreaChart, { DatasetOptions } from "@/components/area-chart";

interface DiskAreaChartProps {
  disk: Enumerable<Disk>;
}

const DiskAreaChart: React.FC<DiskAreaChartProps> = ({ disk }) => {
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
    />
  );
};

export default DiskAreaChart;
