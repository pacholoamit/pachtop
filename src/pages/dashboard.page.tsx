import useGetMetrics from "@/hooks/useGetMetrics";
import SystemInfo from "@/components/system-info";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { Grid, Stack } from "@mantine/core";

const DashboardPage = () => {
  const { memory, swap, globalCpu } = useGetMetrics({
    interval: 1000,
    maxLength: 86400,
  });

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
              xAxisMin={memory[0]?.timestamp - 360000}
            />

            <AreaChart
              title="Swap Memory"
              labels={swap.map((swap) => swap.timestamp)}
              datasets={swapDatasets}
              xAxisMin={swap[0]?.timestamp - 360000}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <AreaChart
            title="CPU Usage"
            labels={globalCpu.map((cpu) => cpu.timestamp)}
            datasets={globalCpuDatasets}
            xAxisMin={globalCpu[0]?.timestamp - 360000}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default DashboardPage;
