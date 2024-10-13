import React, { useEffect } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import StatsRing from "@/components/stats-ring2";
import useMemorySelectors from "@/features/metrics/stores/memory.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import formatOverallStats from "@/features/metrics/utils/format-overall-stats";
import formatStats from "@/features/metrics/utils/format-stats";
import { Grid, useMantineTheme } from "@mantine/core";
import { IconChartArea } from "@tabler/icons-react";

const MemoryAreaChart: React.FC = ({}) => {
  const memory = useMemorySelectors.use.metrics();
  const latestMemory = useMemorySelectors.use.latest();
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

  const available = latestMemory.total;
  const used = latestMemory.used;
  const progress = latestMemory.usedPercentage;

  const stats = React.useMemo(() => formatStats(used), [used]);

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
    <Card style={{ height: "196px" }}>
      <Grid justify="center" align="stretch">
        <Grid.Col span={2} h={"190px"}>
          <StatsRing
            color={other.charts.statsRing.memory}
            Icon={IconChartArea}
            stats={stats}
            label="MEMORY USAGE"
            progress={progress}
          />
        </Grid.Col>
        <Grid.Col span={10} h={"190px"}>
          <AreaChart options={chartOptions} />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default MemoryAreaChart;
