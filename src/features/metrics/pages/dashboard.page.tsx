import PageWrapper from "@/components/page-wrapper";
import CpusBarChart from "@/features/metrics/components/cpus/cpus.bar-charts";
import DiskStatsRing from "@/features/metrics/components/disks/disk.stats-ring";
import GlobalCpuAreaChart from "@/features/metrics/components/global-cpu/global-cpu.area-chart";
import GlobalCpuStatsRing from "@/features/metrics/components/global-cpu/global-cpu.stats-ring";
import MemoryAreaChart from "@/features/metrics/components/memory/memory.area-chart";
import MemoryStatsRing from "@/features/metrics/components/memory/memory.stats-ring";
import NetworksReceivedAreaChart from "@/features/metrics/components/networks/networks-received.area-chart";
import NetworksTransmittedAreaChart from "@/features/metrics/components/networks/networks-transmitted.area-chart";
import SwapAreaChart from "@/features/metrics/components/swap/swap.area-chart";
import SwapStatsRing from "@/features/metrics/components/swap/swap.stats-ring";
import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import useSystemStoreSelectors from "@/features/metrics/stores/system.store";
import { Grid, Group, Title } from "@mantine/core";

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
      <Grid.Col sm={6} md={6} lg={12} xl={3}>
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
      <Grid.Col xl={7.5} lg={6} md={12}>
        <GlobalCpuAreaChart />
      </Grid.Col>
      <Grid.Col xl={4.5} lg={6} md={12}>
        <CpusBarChart />
      </Grid.Col>
    </>
  );
};

const DisksSection = () => {
  return (
    <>
      <Grid.Col md={6} sm={12}>
        <NetworksReceivedAreaChart />
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        <NetworksTransmittedAreaChart />
      </Grid.Col>
    </>
  );
};

const SystemInformationWidget = () => {
  const systemInformation = useSystemStoreSelectors.use.info();
  const globalCpu = useGlobalCpuSelectors.use.latest();
  console.log(systemInformation);
  return (
    <Group>
      <Title order={6}>CPU: {globalCpu.brand}</Title>
      <Title order={6}>CPU cores: {systemInformation.coreCount}</Title>
      <Title order={6}>OS: {systemInformation.os}</Title>
      <Title order={6}>Kernel: {systemInformation.kernelVersion}</Title>
    </Group>
  );
};

const DashboardPage = () => {
  return (
    <PageWrapper name="Dashboard" widget={<SystemInformationWidget />}>
      <Grid gutter="sm">
        <StatsRings />
        <CpuSection />
        <MemorySection />
        <DisksSection />
      </Grid>
    </PageWrapper>
  );
};

export default DashboardPage;
