import SystemInfo from "@/features/metrics/components/system-info";
import MemoryAreaChart from "@/features/metrics/components/memory/memory.area-chart";
import SwapAreaChart from "@/features/metrics/components/swap/swap.area-chart";
import GlobalCpuAreaChart from "@/features/metrics/components/global-cpu/global-cpu.area-chart";
import NetworksAreaChart from "@/features/metrics/components/networks/networks.area-chart";
import MemoryRadialChart from "@/features/metrics/components/memory/memory.radial-chart";
import SwapRadialChart from "@/features/metrics/components/swap/swap.radial-chart";
import CpusBarChart from "@/features/metrics/components/cpus/cpus.bar-chart";
import GlobalCpuStatsRing from "@/features/metrics/components/global-cpu/global-cpu.stats-ring";
import MemoryStatsRing from "@/features/metrics/components/memory/memory.stats-ring";
import SwapStatsRing from "@/features/metrics/components/swap/swap.stats-ring";
import DiskStatsRing from "@/features/metrics/components/disks/disk.stats-ring";

import { Grid, Stack } from "@mantine/core";
import PageWrapper from "@/components/page-wrapper";

// TODO: Make room for system info
const TopMetricsSection = () => {
  return (
    <Grid gutter={"xl"}>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        {/* <SystemInfo /> */}
        <GlobalCpuStatsRing />
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <MemoryStatsRing />
        {/* <GlobalCpuStatsRing /> */}
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <SwapStatsRing />

        {/* <SwapRadialChart /> */}
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <DiskStatsRing />
        {/* <CpusBarChart /> */}
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
    <PageWrapper name="Dashboard">
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
    </PageWrapper>
  );
};

export default DashboardPage;
