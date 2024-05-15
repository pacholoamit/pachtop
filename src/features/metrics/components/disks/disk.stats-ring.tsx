import useServerEventsContext from "@/hooks/useServerEventsContext";
import StatsRing from "@/components/stats-ring";
import formatOverallStats from "@/features/metrics/utils/format-overall-stats";
import React from "react";

import { IconCpu2 } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";

const DiskStatsRing: React.FC = ({}) => {
  const { disks } = useServerEventsContext();
  const { other } = useMantineTheme();

  const disk = disks[0];

  const available = disk?.data?.at(-1)?.total || 0;
  const used = disk?.data?.at(-1)?.used || 0;

  // TODO: MOVE THIS TO RUST BACKEND
  const progress = (used / available) * 100;
  const stats = React.useMemo(() => formatOverallStats(used, available), [used, available]);
  const label = `Disk ${disk?.data?.at(-1)?.name}`;

  return (
    <StatsRing color={other.charts.statsArea.disk} Icon={IconCpu2} stats={stats} label={label} progress={progress} />
  );
};

export default DiskStatsRing;
