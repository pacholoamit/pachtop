import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { createAreaChartInitialState } from "@/components/area-chart.prototype";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import * as Highcharts from "highcharts";
import { useEffect, useState } from "react";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time

const initialState = createAreaChartInitialState({
  title: {
    text: "Random Access Memory (RAM)",
  },
  yAxis: {
    labels: {
      formatter: (x) => formatBytes(x.value as number),
    },
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

const MemoryAreaChart: React.FC = ({}) => {
  const { memory } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>(initialState);

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
    <Card style={{ height: "450px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default MemoryAreaChart;
