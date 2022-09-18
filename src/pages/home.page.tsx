import useGetMetrics from "@/hooks/useGetMetrics";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { Card, Grid, Stack, Title } from "@mantine/core";

const HomePage = () => {
  const { memory, swap } = useGetMetrics();
  const unit = memory.slice(-1)[0]?.unit;

  const ramDatasets: DatasetOptions[] = [
    {
      label: `Ram Total ${unit}`,
      data: memory.map((mem) => mem.total),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "ram-total",
    },
    {
      label: `Ram Used ${unit}`,
      data: memory.map((mem) => mem.used),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "ram-used",
    },
  ];

  const swapDatasets: DatasetOptions[] = [
    {
      label: `Swap Total ${unit}`,
      data: swap.map((swap) => swap.total),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "ram-total",
    },
    {
      label: `Swap Used ${unit}`,
      data: swap.map((swap) => swap.used),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      borderColor: "rgba(53, 162, 235)",
      fill: true,
      yAxisId: "ram-used",
    },
  ];

  return (
    <>
      <Grid gutter="xl">
        <Grid.Col md={6} sm={12}>
          <Stack>
            <AreaChart
              title="Random Access Memory (RAM)"
              labels={memory.map((mem) => mem.timestamp.split(" "))}
              datasets={ramDatasets}
            />

            <AreaChart
              title="Swap Memory"
              labels={swap.map((swap) => swap.timestamp.split(" "))}
              datasets={swapDatasets}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <Title>Welcome to Pachtop</Title>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default HomePage;
