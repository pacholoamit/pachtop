import SystemInfo from "@/components/system-info";
import MemoryChart from "@/features/metrics/components/memory-chart";
import SwapChart from "@/features/metrics/components/swap-chart";
import GlobalCpuChart from "@/features/metrics/components/global-cpu-chart";
import NetworksChart from "@/features/metrics/components/networks-chart";

import { Grid, Stack } from "@mantine/core";

const xAxisMin = Date.now() - 86400;

const DashboardPage = () => {
  return (
    <Grid gutter="xl">
      <Grid.Col span={12}>
        <SystemInfo />
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        <Stack>
          <MemoryChart xAxisMin={xAxisMin} />
          <SwapChart xAxisMin={xAxisMin} />
        </Stack>
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        <Stack>
          <GlobalCpuChart xAxisMin={xAxisMin} />
          <NetworksChart xAxisMin={xAxisMin} />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default DashboardPage;
