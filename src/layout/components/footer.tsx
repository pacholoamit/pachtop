import React, { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import DynamicProgress from "@/components/dynamic-progress";
import useDisksSelectors from "@/features/metrics/stores/disk.store";
import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import useMemorySelectors from "@/features/metrics/stores/memory.store";
import useSwapSelectors from "@/features/metrics/stores/swap.store";
import formatBytes from "@/features/metrics/utils/format-bytes";
import usePreferencesSelector from "@/features/preferences/stores/preferences.store";
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
  const { state, toggle } = usePreferencesSelector(useShallow((state) => state.resourceWidgets.disk));

  const disk = useDisksSelectors(
    useShallow((state) => {
      return {
        name: state.formattedDisks[0].name,
        used: state.formattedDisks[0].used,
        free: state.formattedDisks[0].free,
        freePercentage: state.formattedDisks[0].freePercentage,
        usedPercentage: state.formattedDisks[0].usedPercentage,
      };
    })
  );

  const indicator = useMemo(() => (state === "used" ? "USED" : "FREE"), [state]);
  const progress = useMemo(() => (state === "used" ? disk.usedPercentage : disk.freePercentage), [disk.usedPercentage]);

  console.log(disk);

  return (
    <>
      <Text size="xs" style={{ cursor: "pointer" }} onClick={() => toggle()}>
        Disk {disk.name} {indicator} {disk[state]}
      </Text>
      <MemoizedProgressContainer value={progress} />
    </>
  );
};

const MemoryIndicator = () => {
  const { state, toggle } = usePreferencesSelector(useShallow((state) => state.resourceWidgets.memory));
  const memory = useMemorySelectors(
    useShallow((state) => ({ used: state.latest.used, usedPercentage: state.latest.usedPercentage }))
  );

  const memoryUsedLabel = useMemo(() => formatBytes(memory.used), [formatBytes(memory.used)]);
  return (
    <>
      <Text size="xs">RAM: {memoryUsedLabel} </Text>
      <ProgressContainer value={memory.usedPercentage} />
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
