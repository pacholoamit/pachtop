import { useEffect } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import { useMantineTheme } from "@mantine/core";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time

const GlobalCpuAreaChart: React.FC = () => {
  const metrics = useGlobalCpuSelectors.use.metrics();
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "CPU Usage",
    },
    yAxis: {
      labels: {
        formatter: (x) => `${fromNumberToPercentageString(x.value as number)}`,
      },
      max: 100,
    },
    tooltip: {
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${fromNumberToPercentageString(
          this.y || 0
        )}</b><br/>`;
      },
    },
  });

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: "CPU Usage",
          type: "area",
          data: metrics.map((cpu) => [cpu.timestamp, cpu.usage]),
          color: other.charts.area.globalCpu.color,
        },
      ],
    });
  }, [metrics]);

  return (
    <Card style={{ height: "410px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default GlobalCpuAreaChart;
