import Card from "@/components/card";

import AreaChart, { createAreaChartInitialState } from "@/components/area-chart.prototype";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import * as Highcharts from "highcharts";
import { useEffect, useState } from "react";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time

const initialState = createAreaChartInitialState({
  title: {
    text: "CPU Usage",
  },
  yAxis: {
    labels: {
      formatter: (x) => `${x.value}%`,
    },
  },
  colors: [
    {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, "rgba(255, 99, 132, 1)"],
        [1, "rgba(255, 99, 132, 0.45)"],
      ],
    },
  ],
});
const GlobalCpuAreaChart: React.FC = ({}) => {
  const { globalCpu } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>(initialState);

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: "CPU Usage",
          type: "area",
          data: globalCpu.map((cpu) => [cpu.timestamp, cpu.usage]),
        },
      ],
    });
  }, [globalCpu]);

  return (
    <Card style={{ height: "300px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default GlobalCpuAreaChart;
