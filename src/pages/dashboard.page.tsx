import SystemInfo from "@/features/metrics/components/system-info";
import MemoryChart from "@/features/metrics/components/memory-chart";
import SwapChart from "@/features/metrics/components/swap-chart";
import GlobalCpuChart from "@/features/metrics/components/global-cpu-chart";
import NetworksChart from "@/features/metrics/components/networks-chart";
import MemoryRadialChart from "@/features/metrics/components/memory-radial-chart";
import SwapRadialChart from "@/features/metrics/components/swap-radial-chart";
import CpusBarChart from "@/features/metrics/components/cpus-bar-chart";

import { Grid, Stack } from "@mantine/core";

const xAxisMin = Date.now() - 86400;

const TopMetricsSection = () => {
  return (
    <Grid gutter={"xl"}>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <SystemInfo />
      </Grid.Col>

      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <MemoryRadialChart />
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <SwapRadialChart />
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={12} xl={3}>
        <CpusBarChart />
      </Grid.Col>
    </Grid>
  );
};

const LeftMetricsStack = () => (
  <Stack spacing={"xl"}>
    <MemoryChart xAxisMin={xAxisMin} />
    <SwapChart xAxisMin={xAxisMin} />
  </Stack>
);

const RightMetricsStack = () => (
  <Stack spacing={"xl"}>
    <GlobalCpuChart xAxisMin={xAxisMin} />
    <NetworksChart xAxisMin={xAxisMin} />
  </Stack>
);

const DashboardPage = () => {
  return (
    <Grid gutter="xl">
      <Grid.Col span={12}>
        <TopMetricsSection />
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        <LeftMetricsStack />
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        <RightMetricsStack />
      </Grid.Col>
    </Grid>
  );
};

export default DashboardPage;
