import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { areaChatOptions } from "@/components/area-chart.prototype";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import * as Highcharts from "highcharts";
import { useEffect, useState } from "react";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time
const MemoryAreaChart: React.FC = ({}) => {
  const { memory } = useServerEventsContext();

  console.log("render");
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    ...areaChatOptions,
    title: {
      text: "Random Access Memory (RAM)",
      ...areaChatOptions.title,
    },
    colors: [
      {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "rgba(10, 167, 147, 1)"],
          [1, "rgba(10, 167, 147, 0.45)"],
        ],
      },
    ],
  });

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: "RAM Usage",
          type: "area",
          data: memory.map((mem) => [mem.timestamp, mem.used]),
        },
      ],
    });
  }, [memory]);

  return (
    <Card style={{ height: "300px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default MemoryAreaChart;
