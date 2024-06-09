import { useEffect } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import useSwapSelectors from "@/features/metrics/stores/swap.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { useMantineTheme } from "@mantine/core";

const SwapAreaChart: React.FC = ({}) => {
  const swap = useSwapSelectors.use.metrics();

  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "SWAP Usage",
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
          name: "SWAP Usage",
          type: "area",
          data: swap.map((swap) => [swap.timestamp, swap.used]),
          color: other.charts.area.swap.color,
        },
      ],
    });
  }, [swap]);

  return (
    <Card style={{ height: "380px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default SwapAreaChart;
