import useServerEventsContext from "@/hooks/useServerEventsContext";
import StatsRing from "@/components/stats-ring";
import formatOverallStats from "@/features/metrics/utils/format-overall-stats";
import React from "react";

import { IconCpu2 } from "@tabler/icons-react";

const SwapStatsRing: React.FC = ({}) => {
  const { swap } = useServerEventsContext();

  const available = swap?.at(-1)?.total || 0;
  const used = swap?.at(-1)?.used || 0;
  const progress = swap?.at(-1)?.usedPercentage || 0;

  const stats = React.useMemo(() => formatOverallStats(used, available), [used, available]);

  return <StatsRing color="red" Icon={IconCpu2} stats={stats} label="Swap" progress={progress} />;
};

export default SwapStatsRing;
