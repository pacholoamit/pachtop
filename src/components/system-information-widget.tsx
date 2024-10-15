import { useShallow } from "zustand/react/shallow";

import Card from "@/components/card";
import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import useMemorySelectors from "@/features/metrics/stores/memory.store";
import useSwapSelectors from "@/features/metrics/stores/swap.store";
import useSystemStoreSelectors from "@/features/metrics/stores/system.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { Grid, Group, Text, Title } from "@mantine/core";

const SystemInformationWidget: React.FC = () => {
  const info = useSystemStoreSelectors(useShallow((state) => state.info));
  const cpuBrand = useGlobalCpuSelectors(useShallow((state) => state.latest.brand));

  const memory = useMemorySelectors.use.latest().total;
  const swap = useSwapSelectors.use.latest().total;

  return (
    <Card height="">
      <Grid>
        <Grid.Col md={2} sm={6}>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            CPU
          </Text>
          <Text size={"sm"}>{cpuBrand}</Text>
        </Grid.Col>
        <Grid.Col md={2} sm={6}>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            OS
          </Text>
          <Text size={"sm"}>{info.os}</Text>
        </Grid.Col>
        <Grid.Col md={2} sm={6}>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            CPU cores
          </Text>
          <Text size={"sm"}>{info.coreCount}</Text>
        </Grid.Col>

        <Grid.Col md={2} sm={6}>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            Kernel
          </Text>
          <Text size={"sm"}>{info.kernelVersion}</Text>
        </Grid.Col>
        <Grid.Col md={2} sm={6}>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            Memory
          </Text>
          <Text size={"sm"}>{formatBytes(memory)}</Text>
        </Grid.Col>
        <Grid.Col md={2} sm={6}>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            Swap
          </Text>
          <Text size={"sm"}>{formatBytes(swap)}</Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default SystemInformationWidget;
