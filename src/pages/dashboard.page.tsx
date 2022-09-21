import useGetMetrics from "@/hooks/useGetMetrics";
import SystemInfo from "@/components/system-info";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { Grid, Stack } from "@mantine/core";
import { useEffect } from "react";

const DashboardPage = () => {
  const { memory, swap, globalCpu, networks } = useGetMetrics({
    interval: 1000,
    maxLength: 86400,
  });

  const xAxisMin = Date.now() - 86400;

  const ramDatasets: DatasetOptions[] = [
    {
      label: `Ram Used ${memory.slice(-1)[0]?.unit}`,
      data: memory.map((mem) => ({ x: mem.timestamp, y: mem.used })),
      backgroundColor: "rgba(10, 167, 147, 0.45)",
      borderColor: "rgba(10, 167, 147, 1)",
      fill: true,
      yAxisId: "ram-used",
    },
  ];

  const swapDatasets: DatasetOptions[] = [
    {
      label: `Swap Used ${memory.slice(-1)[0]?.unit}`,
      data: swap.map((swap) => ({ x: swap.timestamp, y: swap.used })),
      backgroundColor: "rgba(53, 162, 235, 0.45)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "swap-used",
    },
  ];

  const globalCpuDatasets: DatasetOptions[] = [
    {
      label: "CPU Usage (%)",
      data: globalCpu.map((cpu) => ({ x: cpu.timestamp, y: cpu.cpuUsage })),
      backgroundColor: "rgba(255, 99, 132, 0.45)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "cpu-usage",
    },
  ];

  const networksDatasets: DatasetOptions[] = [
    {
      label: "Networks",
      data: networks.map((network) => ({
        x: network[0].timestamp,
        y: network[0].transmitted,
      })),
      backgroundColor: "rgba(255, 99, 132, 0.45)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "networks",
    },
  ];

  return (
    <>
      <Grid gutter="xl">
        <Grid.Col span={12}>
          <SystemInfo />
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <Stack>
            <AreaChart
              title="Random Access Memory (RAM)"
              labels={memory.map((mem) => mem.timestamp)}
              datasets={ramDatasets}
              xAxisMin={xAxisMin}
            />

            <AreaChart
              title="Swap Memory"
              labels={swap.map((swap) => swap.timestamp)}
              datasets={swapDatasets}
              xAxisMin={xAxisMin}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <AreaChart
            title="CPU Usage"
            labels={globalCpu.map((cpu) => cpu.timestamp)}
            datasets={globalCpuDatasets}
            xAxisMin={xAxisMin}
          />
          <AreaChart
            title="Network Usage"
            labels={networks[0]?.map((net) => net.timestamp)}
            datasets={networksDatasets}
            xAxisMin={xAxisMin}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default DashboardPage;
