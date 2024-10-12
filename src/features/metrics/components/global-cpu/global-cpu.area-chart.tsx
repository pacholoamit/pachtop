import React, { useEffect } from "react";

import AreaChart, { useAreaChartState } from "@/components/area-chart";
import Card from "@/components/card";
import GlobalCpuStatsRing from "@/features/metrics/components/global-cpu/global-cpu.stats-ring";
import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import {
  Box,
  Center,
  DefaultMantineColor,
  Divider,
  Grid,
  Group,
  rem,
  RingProgress,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCpu, TablerIconsProps } from "@tabler/icons-react";

// TODO: Remove Luxon and ChartJS
// TODO: Make timestamp work automatically
// TODO: fix time

interface StatsRingProps {
  label: string;
  stats: string;
  progress: number;
  color: DefaultMantineColor;
  Icon: (props: TablerIconsProps) => JSX.Element;
}

const StatsRing: React.FC<StatsRingProps> = (props) => {
  return (
    <RingProgress
      size={120}
      roundCaps
      thickness={6.5}
      sections={[{ value: props.progress, color: props.color }]}
      label={
        <Center>
          <Text fw={700} size={"lg"} sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {props.stats}
          </Text>
        </Center>
      }
    />
  );
};

const GlobalCpuAreaChart: React.FC = ({}) => {
  const metrics = useGlobalCpuSelectors.use.metrics();
  const globalCpu = useGlobalCpuSelectors.use.latest();
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

  const progress = globalCpu.usage;
  const stats = React.useMemo(() => fromNumberToPercentageString(progress), [progress]);

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
    <Card style={{ height: "196px" }}>
      <Grid justify="center" align="stretch">
        <Grid.Col
          span={3}
          h={"190px"}
          style={{
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
          }}
        >
          <Center>
            <Group>
              <Stack align="center">
                <Text
                  c="dimmed"
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  CPU Usage
                </Text>
                <StatsRing
                  color={other.charts.statsRing.cpu}
                  Icon={IconCpu}
                  stats={stats}
                  label="CPU"
                  progress={progress}
                />
              </Stack>
            </Group>
          </Center>
        </Grid.Col>

        <Grid.Col span={9} h={"190px"}>
          <AreaChart options={chartOptions} />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default GlobalCpuAreaChart;
