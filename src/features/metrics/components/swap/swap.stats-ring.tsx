import useServerEventsContext from "@/hooks/useServerEventsContext";
import StatsRing from "@/components/stats-ring";
import fromNumberToPercentageString from "@/features/metrics/utils/from-number-to-percentage-string";
import { IconCpu2 } from "@tabler/icons-react";
import React from "react";
import formatBytes from "../../utils/format-bytes";

const formatMemoryMetrics = (used: number, total: number) => {
  const usedFormatted = formatBytes(used);
  const totalFormatted = formatBytes(total);

  return `${usedFormatted} / ${totalFormatted}`;
};

const SwapStatsRing: React.FC = ({}) => {
  const { swap } = useServerEventsContext();

  const available = swap?.at(-1)?.total || 0;
  const used = swap?.at(-1)?.used || 0;
  const progress = swap?.at(-1)?.usedPercentage || 0;

  const stats = React.useMemo(() => formatMemoryMetrics(used, available), [used, available]);

  return <StatsRing color="red" Icon={IconCpu2} stats={stats} label="Swap" progress={progress} />;
};

export default SwapStatsRing;
