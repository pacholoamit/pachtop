import React, { useEffect } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import StatsRing from "@/components/stats-ring2";
import useSwapSelectors from "@/features/metrics/stores/swap.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import formatOverallStats from "@/features/metrics/utils/format-overall-stats";
import formatStats from "@/features/metrics/utils/format-stats";
import { Grid, useMantineTheme } from "@mantine/core";
import { IconFile } from "@tabler/icons-react";

const SwapAreaChart: React.FC = ({}) => {
  const swap = useSwapSelectors.use.metrics();
  const latestSwap = useSwapSelectors.use.latest();

  const { other } = useMantineTheme();

  const available = latestSwap.total;
  const used = latestSwap.used;
  const progress = latestSwap.usedPercentage;

  const stats = React.useMemo(() => formatStats(used), [used]);

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
    <Card style={{ height: "190px" }}>
      <Grid justify="center" align="stretch">
        <Grid.Col span={2} h={"190px"}>
          <StatsRing
            color={other.charts.statsRing.swap}
            stats={stats}
            label="SWAP USAGE"
            Icon={IconFile}
            progress={progress}
          />
        </Grid.Col>
        <Grid.Col span={10} style={{ height: "190px" }}>
          <AreaChart options={chartOptions} />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default SwapAreaChart;
