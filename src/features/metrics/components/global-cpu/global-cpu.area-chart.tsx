import Card from "@/components/card";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import { useEffect } from "react";
import { useMantineTheme } from "@mantine/core";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time

const GlobalCpuAreaChart: React.FC = ({}) => {
  const { globalCpu } = useServerEventsContext();
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "CPU Usage",
    },
    yAxis: {
      labels: {
        formatter: (x) => `${x.value}%`,
      },
      max: 100,
    },
    tooltip: {
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y}%</b><br/>`;
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
          color: other.charts.area.globalCpu.color,
        },
      ],
    });
  }, [globalCpu]);

  return (
    <Card style={{ height: "410px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default GlobalCpuAreaChart;
