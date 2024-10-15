import { useShallow } from 'zustand/react/shallow';

import DashboardSectionsDivider from '@/components/dashboard-section-divider';
import PageWrapper from '@/components/page-wrapper';
import SystemInformationWidget from '@/components/system-information-widget';
import CpusBarChart from '@/features/metrics/components/cpus/cpus.bar-charts';
import DiskAreaChart from '@/features/metrics/components/disks/disk.area-chart';
import DiskStatsRing from '@/features/metrics/components/disks/disk.stats-ring';
import GlobalCpuAreaChart from '@/features/metrics/components/global-cpu/global-cpu.area-chart';
import GlobalCpuStatsRing from '@/features/metrics/components/global-cpu/global-cpu.stats-ring';
import MemoryAreaChart from '@/features/metrics/components/memory/memory.area-chart';
import MemoryStatsRing from '@/features/metrics/components/memory/memory.stats-ring';
import NetworksReceivedAreaChart from '@/features/metrics/components/networks/networks-received.area-chart';
import NetworksTransmittedAreaChart from '@/features/metrics/components/networks/networks-transmitted.area-chart';
import SwapAreaChart from '@/features/metrics/components/swap/swap.area-chart';
import SwapStatsRing from '@/features/metrics/components/swap/swap.stats-ring';
import useDisksSelectors from '@/features/metrics/stores/disk.store';
import useSystemStoreSelectors from '@/features/metrics/stores/system.store';
import useRandomGreeting from '@/hooks/useRandomGreeting';
import { Box, Center, Divider, Grid, Text } from '@mantine/core';

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
      <Grid.Col md={6} sm={12}>
        <GlobalCpuAreaChart />
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        <CpusBarChart />
      </Grid.Col>
    </>
  );
};

const NetworksSection = () => {
  return (
    <>
      <Grid.Col md={6} sm={12} offset={6}>
        <NetworksReceivedAreaChart />
      </Grid.Col>
      <Grid.Col md={6} sm={12} offset={6}>
        <NetworksTransmittedAreaChart />
      </Grid.Col>
    </>
  );
};

const DiskSection = () => {
  const disks = useDisksSelectors.use.disks();

  if (disks.length === 0) {
    return <DashboardNoDataAvailable message="No disk data available" />;
  }

  return (
    <>
      {disks.map((disk) => (
        <Grid.Col key={disk.mountPoint} md={6} sm={12}>
          <DiskAreaChart disk={disk} />
        </Grid.Col>
      ))}
    </>
  );
};

const TempsSection = () => {
  const temps = [];

  if (temps.length === 0) {
    return <DashboardNoDataAvailable message="No temperature data available" />;
  }
};

interface DashboardNoDataAvailableProps {
  message: string;
}
const DashboardNoDataAvailable = ({ message }: DashboardNoDataAvailableProps) => {
  return (
    <Center maw={400} h={190} mx="auto">
      <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
        {message}
      </Text>
    </Center>
  );
};

const DashboardPage = () => {
  const hostname = useSystemStoreSelectors(useShallow((state) => state.info.hostname));
  const greeting = useRandomGreeting(hostname);
  return (
    <PageWrapper name={greeting}>
      <Grid gutter="sm">
        <Grid.Col span={12}>
          <SystemInformationWidget />
        </Grid.Col>
        <DashboardSectionsDivider label="General" />
        <CpuSection />
        <MemorySection />
        <DashboardSectionsDivider label="Disks" />
        <DiskSection />
        <DashboardSectionsDivider label="Temps" />
        <TempsSection />
        {/* <NetworksSection /> */}
      </Grid>
    </PageWrapper>
  );
};

export default DashboardPage;
