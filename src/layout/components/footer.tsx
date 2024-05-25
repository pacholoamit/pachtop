import DynamicProgress from "@/components/dynamic-progress";
import useDisksSelectors from "@/features/metrics/stores/disk.store";
import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import useMemorySelectors from "@/features/metrics/stores/memory.store";
import useSwapSelectors from "@/features/metrics/stores/swap.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { Box, Footer, Group, Text } from "@mantine/core";

const ProgressContainer = ({ value }: { value: number }) => {
  return (
    <Box w={50}>
      <DynamicProgress size={"xs"} value={value} />
    </Box>
  );
};
const AppFooter = () => {
  const memory = useMemorySelectors.use.latest();
  const cpu = useGlobalCpuSelectors.use.latest();
  const swap = useSwapSelectors.use.latest();
  const [disk] = useDisksSelectors.use.disks();

  return (
    <Footer height={18} pl={12} pr={12}>
      <Group position={"right"}>
        <Text size="xs">RAM: {formatBytes(memory.used)} </Text>
        <ProgressContainer value={memory.usedPercentage} />
        <Text size="xs">CPU: {cpu.usage.toFixed(2)}%</Text>
        <ProgressContainer value={cpu.usage} />
        <Text size="xs">Swap: {formatBytes(swap.used)}</Text>
        <ProgressContainer value={swap.usedPercentage} />
        <Text size="xs">
          Disk {disk.name} {formatBytes(disk.used)}
        </Text>
        <ProgressContainer value={disk.usedPercentage} />
      </Group>
    </Footer>
  );
};

export default AppFooter;
