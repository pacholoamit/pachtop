import { useEffect, useState } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import StatsRing from "@/components/stats-ring2";
import { VIEWABLE_ELEMENT_COUNT } from "@/contants";
import useDisksSelectors, { FormattedDisk } from "@/features/metrics/stores/disk.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { Disk } from "@/lib";
import { Grid, useMantineTheme } from "@mantine/core";
import { IconCpu } from "@tabler/icons-react";

interface DiskAreaChartProps {
  disk: Disk;
}

interface DiskMetricsState {
  timestamp: number;
  used: number;
}

const DiskAreaChart = ({ disk }: DiskAreaChartProps) => {
  const { other } = useMantineTheme();
  //! TODO: Use `useEnumerableStore` hook here , currently just a hack
  const [diskMetrics, setDiskMetrics] = useState<DiskMetricsState[]>([]);
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: `Disk Usage`,
    },
    yAxis: {
      labels: {
        formatter: (x) => `${formatBytes(x.value as number)}`,
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
    setDiskMetrics((prev) => {
      if (prev.length > VIEWABLE_ELEMENT_COUNT) prev.shift();
      return [...prev, { timestamp: disk.timestamp, used: disk.used } as DiskMetricsState];
    });

    setChartOptions({
      series: [
        {
          name: `Disk Usage`,
          type: "area",
          data: diskMetrics.map((disk) => [disk.timestamp, disk.used]),
          color: other.charts.area.disk.color,
        },
      ],
    });
  }, [disk]);

  const stats = formatBytes(disk.used);
  const progress = disk.usedPercentage;

  return (
    <Card style={{ height: "196px" }}>
      <Grid justify="center" align="stretch">
        <Grid.Col span={2} h={"190px"} style={{}}>
          <StatsRing color={"indigo"} Icon={IconCpu} stats={stats} label={`Disk ${disk.name}`} progress={progress} />
        </Grid.Col>

        <Grid.Col span={10} h={"190px"}>
          <AreaChart options={chartOptions} />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default DiskAreaChart;
