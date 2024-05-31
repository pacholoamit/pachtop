import { useEffect } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import useMemorySelectors from "@/features/metrics/stores/memory.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { useMantineTheme } from "@mantine/core";

const MemoryAreaChart: React.FC = () => {
  const memory = useMemorySelectors.use.metrics();
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "RAM Usage",
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
          color: other.charts.area.memory.color,
        },
      ],
    });
  }, [memory]);

  return (
    <Card style={{ height: "410px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default MemoryAreaChart;
