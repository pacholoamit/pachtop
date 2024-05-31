import React from "react";
import { useShallow } from "zustand/react/shallow";

import StatsRing from "@/components/stats-ring";
import useDisksStore from "@/features/metrics/stores/disk.store";
import { useMantineTheme } from "@mantine/core";
import { IconFolders } from "@tabler/icons-react";

const DiskStatsRing: React.FC = ({}) => {
  const [disk] = useDisksStore(useShallow((state) => state.formattedDisks));
  const { other } = useMantineTheme();

  return (
    <StatsRing
      color={other.charts.statsRing.disk}
      Icon={IconFolders}
      stats={disk.overall}
      label={`Disk ${disk.name}`}
      progress={disk.usedPercentage}
    />
  );
};

export default DiskStatsRing;
