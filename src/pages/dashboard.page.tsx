import useGetMetrics from "@/hooks/useGetMetrics";
import SystemInfo from "@/components/system-info";
import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { Grid, Stack } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { Memory, Network, TauriCommand } from "@/lib/types";
import useRequestMetrics from "@/hooks/useRequestMetrics";

interface UniqueNetwork {
  name: string;
  unit: string;
  data: UniqueNetworkData[];
}

interface UniqueNetworkData {
  received: number;
  timestamp: number;
}

const xAxisMin = Date.now() - 86400;

const DashboardPage = () => {
  const [uniqueNetworks, setUniqueNetworks] = useState<UniqueNetwork[]>([]);
  const [memory] = useRequestMetrics<Memory>(TauriCommand.Memory);
  const { swap, globalCpu, networks } = useGetMetrics({
    interval: 1000,
    maxLength: 86400,
  });

  const ramDatasets: DatasetOptions[] = [
    {
      label: `Ram Used (${memory.slice(-1)[0]?.unit})`,
      data: memory.map((mem) => ({ x: mem.timestamp, y: mem.used })),
      backgroundColor: "rgba(10, 167, 147, 0.45)",
      borderColor: "rgba(10, 167, 147, 1)",
      fill: true,
      yAxisId: "ram-used",
    },
  ];

  const swapDatasets: DatasetOptions[] = [
    {
      label: `Swap Used (${memory.slice(-1)[0]?.unit})`,
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

  useEffect(() => {
    networks.at(-1)?.filter((network) => {
      if (!uniqueNetworks.some((n) => n?.name === network.name)) {
        setUniqueNetworks((prev) => [
          ...prev,
          {
            name: network.name,
            unit: network.unit,
            data: [
              {
                received: network.received,
                timestamp: network.timestamp,
              },
            ],
          },
        ]);
      } else {
        const i = uniqueNetworks.findIndex((n) => n?.name === network.name);
        setUniqueNetworks((prev) => {
          prev[i].data.push({
            timestamp: network.timestamp,
            received: network.received,
          });
          return prev;
        });
      }
    });
  }, [networks]);

  let networkDatasets: DatasetOptions[] = uniqueNetworks.map((network) => ({
    label: `${network.name} (${network.unit})`,
    data: network.data.map((data) => ({
      x: data.timestamp,
      y: data.received,
    })),
    backgroundColor: "rgba(255,215,120,0.4)",
    borderColor: "rgba(255,215,120,1)",
    fill: true,
    yAxisId: "network-received",
  }));

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
          <Stack>
            <AreaChart
              title="CPU Usage"
              labels={globalCpu.map((cpu) => cpu.timestamp)}
              datasets={globalCpuDatasets}
              xAxisMin={xAxisMin}
            />
            <AreaChart
              title="Network Received"
              labels={uniqueNetworks.map(
                (network) => network.data[0].timestamp
              )}
              datasets={networkDatasets}
              xAxisMin={xAxisMin}
              stacked={true}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default DashboardPage;
