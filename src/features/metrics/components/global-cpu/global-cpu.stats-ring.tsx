import React from "react";

import StatsRing from "@/components/stats-ring";
import useGlobalCpuSelectors from "@/features/metrics/stores/global-cpu.store";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import { useMantineTheme } from "@mantine/core";
import { IconCpu } from "@tabler/icons-react";

const GlobalCpuStatsRing: React.FC = () => {
  const globalCpu = useGlobalCpuSelectors.use.latest();
  const { other } = useMantineTheme();

  const progress = globalCpu.usage;
  const stats = React.useMemo(() => fromNumberToPercentageString(progress), [progress]);

  return <StatsRing color={other.charts.statsRing.cpu} Icon={IconCpu} stats={stats} label="CPU" progress={progress} />;
};

export default GlobalCpuStatsRing;
