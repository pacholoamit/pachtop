import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { useAreaChartState } from "@/components/area-chart";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import { useEffect } from "react";

const MemoryAreaChart: React.FC = ({}) => {
  const { memory } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "Ram Usage",
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

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: "RAM Usage",
          type: "area",
          data: memory.map((mem) => [mem.timestamp, mem.used]),
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, "rgba(10, 167, 147, 1)"],
              [1, "rgba(10, 167, 147, 0.45)"],
            ],
          },
        },
      ],
    });
  }, [memory]);

  return (
    <Card style={{ height: "450px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default MemoryAreaChart;
