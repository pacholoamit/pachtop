import React from "react";

import StatsRing from "@/components/stats-ring";
import useMemorySelectors from "@/features/metrics/stores/memory.store";
import formatOverallStats from "@/features/metrics/utils/format-overall-stats";
import { useMantineTheme } from "@mantine/core";
import { IconChartArea } from "@tabler/icons-react";

const MemoryStatsRing: React.FC = ({}) => {
  const memory = useMemorySelectors.use.latest();
  const { other } = useMantineTheme();

  const available = memory.total;
  const used = memory.used;
  const progress = memory.usedPercentage;

  const stats = React.useMemo(() => formatOverallStats(used, available), [used, available]);

  return (
    <StatsRing
      color={other.charts.statsRing.memory}
      Icon={IconChartArea}
      stats={stats}
      label="Memory"
      progress={progress}
    />
  );
};

export default MemoryStatsRing;
