import useGetMetrics from "@/hooks/useGetMetrics";
import SystemInfo from "@/components/system-info";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { Grid, Stack } from "@mantine/core";

const HomePage = () => {
  const { memory, swap } = useGetMetrics({ interval: 1000, maxLength: 86400 });
  const unit = memory.slice(-1)[0]?.unit;

  const ramDatasets: DatasetOptions[] = [
    {
      label: `Ram Used ${unit}`,
      data: memory.map((mem) => ({ x: mem.timestamp, y: mem.used })),
      backgroundColor: "rgba(10, 167, 147, 0.45)",
      borderColor: "rgba(10, 167, 147, 1)",
      fill: true,
      yAxisId: "ram-used",
    },
  ];

  const swapDatasets: DatasetOptions[] = [
    {
      label: `Swap Used ${unit}`,
      data: swap.map((swap) => ({ x: swap.timestamp, y: swap.used })),
      backgroundColor: "rgba(53, 162, 235, 0.45)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "swap-used",
    },
  ];

  return (
    <>
      <Grid gutter="xl">
        <Grid.Col md={6} sm={12}>
          <Stack>
            <AreaChart
              title="Random Access Memory (RAM)"
              labels={memory.map((mem) => mem.timestamp)}
              datasets={ramDatasets}
            />

            <AreaChart
              title="Swap Memory"
              labels={swap.map((swap) => swap.timestamp)}
              datasets={swapDatasets}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <SystemInfo />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default HomePage;
