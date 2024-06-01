import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

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

const MemoizedProgressContainer = memo(ProgressContainer);

const DiskIndicator = () => {
  const disk = useDisksSelectors(
    useShallow((state) => {
      return {
        name: state.disks[0].name,
        used: state.disks[0].used,
        usedPercentage: state.disks[0].usedPercentage,
      };
    })
  );

  const diskUsed = useMemo(() => formatBytes(disk.used), [disk.used]);

  return (
    <>
      <Text size="xs">
        Disk {disk.name} {diskUsed}
      </Text>
      <MemoizedProgressContainer value={disk.usedPercentage} />
    </>
  );
};

const MemoryIndicator = () => {
  const memoryUsed = useMemorySelectors(useShallow((state) => state.latest.used));
  const memoryUsedPercentage = useMemorySelectors(useShallow((state) => state.latest.usedPercentage));

  const memoryUsedLabel = useMemo(() => formatBytes(memoryUsed), [memoryUsed]);
  return (
    <>
      <Text size="xs">RAM: {memoryUsedLabel} </Text>
      <ProgressContainer value={memoryUsedPercentage} />
    </>
  );
};

const SwapIndicator = () => {
  const swap = useSwapSelectors(
    useShallow((state) => {
      return {
        used: state.latest.used,
        usedPercentage: state.latest.usedPercentage,
      };
    })
  );

  const swapUsed = useMemo(() => formatBytes(swap.used), [swap.used]);
  return (
    <>
      <Text size="xs">Swap: {swapUsed}</Text>
      <ProgressContainer value={swap.usedPercentage} />
    </>
  );
};

const CpuIndicator = () => {
  const cpu = useGlobalCpuSelectors.use.latest();
  const cpuUsage = useMemo(() => cpu.usage.toFixed(2), [cpu.usage]);
  return (
    <>
      <Text size="xs">CPU: {cpuUsage}%</Text>
      <ProgressContainer value={cpu.usage} />
    </>
  );
};

const AppFooterContents = () => {
  return (
    <>
      <MemoryIndicator />
      <CpuIndicator />
      <SwapIndicator />
      <DiskIndicator />
    </>
  );
};

const AppFooter = () => {
  return (
    <Footer height={18} pl={12} pr={12}>
      <Group position={"right"}>
        <AppFooterContents />
      </Group>
    </Footer>
  );
};

export default memo(AppFooter);
