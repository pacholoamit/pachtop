import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { Enumerable } from "@/hooks/useServerEventsEnumerableStore";
import { Disk } from "@/lib/types";
import AreaChart, { useAreaChartState } from "@/components/area-chart.prototype";
import { useEffect } from "react";

interface DiskAreaChartProps {
  disk: Enumerable<Disk>;
}

const DiskAreaChart: React.FC<DiskAreaChartProps> = ({ disk }) => {
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "Network Received",
    },
    yAxis: {
      labels: {
        formatter: (x) => formatBytes(x.value as number),
      },
    },
    tooltip: {
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
          this.y as number
        )}</b><br/>`;
      },
    },
  });

  const linearGradient = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 1,
  };

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: `${disk.id} (Used)`,
          type: "area",
          data: disk.data.map((net) => [net.timestamp, net.used]),
          color: {
            linearGradient,
            stops: [
              [0, "rgba(255,215,120,1)"],
              [1, "rgba(255,215,120,0.4)"],
            ],
          },
        },
        {
          name: `${disk.id} (Free)`,
          type: "area",
          data: disk.data.map((net) => [net.timestamp, net.free]),
          color: {
            linearGradient,
            stops: [
              [0, "rgba(10, 167, 147, 1)"],
              [1, "rgba(10, 167, 147, 0.45)"],
            ],
          },
        },
      ],
    });
  }, [disk]);
  //   const datasets: DatasetOptions[] = [
  //     {
  //       label: disk.id + " (Used)",
  //       data: disk.data.map((data) => ({
  //         x: data.timestamp,
  //         y: data.used,
  //       })),
  //       backgroundColor: "rgba(255,215,120,0.4)",
  //       borderColor: "rgba(255,215,120,1)",
  //       fill: true,
  //       yAxisId: "disk-used",
  //     },
  //     {
  //       label: disk.id + " (Free)",
  //       data: disk.data.map((data) => ({
  //         x: data.timestamp,
  //         y: data.free,
  //       })),
  //       backgroundColor: "rgba(10, 167, 147, 0.45)",
  //       borderColor: "rgba(10, 167, 147, 1)",
  //       fill: true,
  //       yAxisId: "disk-free",
  //     },
  //   ];

  return (
    <Card style={{ height: "450px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default DiskAreaChart;
