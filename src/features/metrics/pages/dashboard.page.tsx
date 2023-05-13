import SystemInfo from "@/features/metrics/components/system-info";
import MemoryAreaChart from "@/features/metrics/components/memory/memory.area-chart";
import SwapAreaChart from "@/features/metrics/components/swap/swap.area-chart";
import GlobalCpuAreaChart from "@/features/metrics/components/global-cpu/global-cpu.area-chart";
import NetworksAreaChart from "@/features/metrics/components/networks/networks.area-chart";
import MemoryRadialChart from "@/features/metrics/components/memory/memory.radial-chart";
import SwapRadialChart from "@/features/metrics/components/swap/swap.radial-chart";
import CpusBarChart from "@/features/metrics/components/cpus/cpus.bar-chart";

import { Grid, Stack } from "@mantine/core";

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
    <MemoryAreaChart />
    <SwapAreaChart />
  </Stack>
);

const RightMetricsStack = () => (
  <Stack spacing={"xl"}>
    <GlobalCpuAreaChart />
    <NetworksAreaChart />
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
