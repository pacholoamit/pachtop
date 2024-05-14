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

const MemoryStatsRing: React.FC = ({}) => {
  const { memory } = useServerEventsContext();

  const available = memory?.at(-1)?.total || 0;
  const used = memory?.at(-1)?.used || 0;
  const progress = memory?.at(-1)?.usedPercentage || 0;

  const stats = React.useMemo(() => formatMemoryMetrics(used, available), [used, available]);

  return <StatsRing color="cyan" Icon={IconCpu2} stats={stats} label="Memory" progress={progress} />;
};

export default MemoryStatsRing;
