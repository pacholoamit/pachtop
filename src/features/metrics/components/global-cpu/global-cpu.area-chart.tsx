import Card from "@/components/card";

import AreaChart, { useAreaChartState } from "@/components/area-chart.prototype";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import * as Highcharts from "highcharts";
import { useEffect, useState } from "react";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time

const GlobalCpuAreaChart: React.FC = ({}) => {
  const { globalCpu } = useServerEventsContext();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "CPU Usage",
    },
    yAxis: {
      labels: {
        formatter: (x) => `${x.value}%`,
      },
    },
  });

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: "CPU Usage",
          type: "area",
          data: globalCpu.map((cpu) => [cpu.timestamp, cpu.usage]),
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, "rgba(255, 99, 132, 1)"],
              [1, "rgba(255, 99, 132, 0.45)"],
            ],
          },
        },
      ],
    });
  }, [globalCpu]);

  return (
    <Card style={{ height: "450px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default GlobalCpuAreaChart;
