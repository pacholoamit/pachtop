import useServerEventsContext from "@/hooks/useServerEventsContext";
import StatsRing from "@/components/stats-ring";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import React from "react";

import { IconCpu } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";

const GlobalCpuStatsRing: React.FC = ({}) => {
  const { globalCpu } = useServerEventsContext();
  const { other } = useMantineTheme();

  const progress = globalCpu.at(-1)?.usage || 0;
  const stats = React.useMemo(() => fromNumberToPercentageString(progress), [progress]);

  return <StatsRing color={other.charts.statsArea.cpu} Icon={IconCpu} stats={stats} label="CPU" progress={progress} />;
};

export default GlobalCpuStatsRing;
