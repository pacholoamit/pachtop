import React from "react";

import StatsRing from "@/components/stats-ring";
import useDisksStore from "@/features/metrics/stores/disk.store";
import formatOverallStats from "@/features/metrics/utils/format-overall-stats";
import { useMantineTheme } from "@mantine/core";
import { IconFolders } from "@tabler/icons-react";

const DiskStatsRing: React.FC = ({}) => {
  const [disk] = useDisksStore((state) => state.disks);
  const { other } = useMantineTheme();

  const available = disk.total || 0;
  const used = disk.used || 0;

  // TODO: Use USED PERCENTAGE property
  const progress = (used / available) * 100;
  const stats = React.useMemo(() => formatOverallStats(used, available), [used, available]);
  const label = `Disk ${disk.name}`;

  return (
    <StatsRing color={other.charts.statsRing.disk} Icon={IconFolders} stats={stats} label={label} progress={progress} />
  );
};

export default DiskStatsRing;
