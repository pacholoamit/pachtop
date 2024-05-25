import React from "react";

import StatsRing from "@/components/stats-ring";
import useSwapSelectors from "@/features/metrics/stores/swap.store";
import formatOverallStats from "@/features/metrics/utils/format-overall-stats";
import { useMantineTheme } from "@mantine/core";
import { IconFile } from "@tabler/icons-react";

const SwapStatsRing: React.FC = ({}) => {
  const swap = useSwapSelectors.use.latest();
  const { other } = useMantineTheme();

  const available = swap.total;
  const used = swap.used;
  const progress = swap.usedPercentage;

  const stats = React.useMemo(() => formatOverallStats(used, available), [used, available]);

  return (
    <StatsRing color={other.charts.statsRing.swap} Icon={IconFile} stats={stats} label="Swap" progress={progress} />
  );
};

export default SwapStatsRing;
