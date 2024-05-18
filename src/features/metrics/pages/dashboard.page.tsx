import SystemInfo from "@/features/metrics/components/system-info";
import MemoryAreaChart from "@/features/metrics/components/memory/memory.area-chart";
import SwapAreaChart from "@/features/metrics/components/swap/swap.area-chart";
import GlobalCpuAreaChart from "@/features/metrics/components/global-cpu/global-cpu.area-chart";
import NetworksAreaChart from "@/features/metrics/components/networks/networks.area-chart";
import MemoryRadialChart from "@/features/metrics/components/memory/memory.radial-chart";
import SwapRadialChart from "@/features/metrics/components/swap/swap.radial-chart";
import GlobalCpuStatsRing from "@/features/metrics/components/global-cpu/global-cpu.stats-ring";

import MemoryStatsRing from "@/features/metrics/components/memory/memory.stats-ring";
import SwapStatsRing from "@/features/metrics/components/swap/swap.stats-ring";
import DiskStatsRing from "@/features/metrics/components/disks/disk.stats-ring";

import { Grid, Stack, Title } from "@mantine/core";
import PageWrapper from "@/components/page-wrapper";
import CpusRadialChart from "../components/cpus/cpus.bar-charts";

// TODO: Unused metrics

/* <CpusBarChart /> */
// <SwapRadialChart /> */
/* <GlobalCpuStatsRing /> */
/* <SystemInfo /> */

const StatsRings = () => {
  return (
    <>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <GlobalCpuStatsRing />
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <MemoryStatsRing />
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <SwapStatsRing />
      </Grid.Col>
      <Grid.Col sm={6} md={6} lg={4} xl={3}>
        <DiskStatsRing />
      </Grid.Col>
    </>
  );
};

const MemorySection = () => {
  return (
    <>
      <Grid.Col md={6} sm={12}>
        <MemoryAreaChart />
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        <SwapAreaChart />
      </Grid.Col>
    </>
  );
};

const CpuSection = () => {
  return (
    <>
      <Grid.Col md={7.5} sm={12}>
        <GlobalCpuAreaChart />
      </Grid.Col>
      <Grid.Col md={4.5} sm={12}>
        <CpusRadialChart />
      </Grid.Col>
    </>
  );
};

const DashboardPage = () => {
  return (
    <PageWrapper name="Dashboard">
      <Grid gutter="sm">
        <StatsRings />
        <CpuSection />
        <MemorySection />

        {/* <Grid.Col md={6} sm={12}>
          <GlobalCpuAreaChart />
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <NetworksAreaChart />
        </Grid.Col> */}
      </Grid>
    </PageWrapper>
  );
};

export default DashboardPage;
