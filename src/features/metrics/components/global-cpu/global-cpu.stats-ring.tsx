import React from 'react';

import StatsRing from '@/components/stats-ring';
import fromNumberToPercentageString from '@/features/metrics/utils/from-number-to-percentage-string';
import useServerEventsContext from '@/hooks/useServerEventsContext';
import { useMantineTheme } from '@mantine/core';
import { IconCpu } from '@tabler/icons-react';

const GlobalCpuStatsRing: React.FC = ({}) => {
  const { globalCpu } = useServerEventsContext();
  const { other } = useMantineTheme();

  const progress = globalCpu.at(-1)?.usage || 0;
  const stats = React.useMemo(() => fromNumberToPercentageString(progress), [progress]);

  return <StatsRing color={other.charts.statsRing.cpu} Icon={IconCpu} stats={stats} label="CPU" progress={progress} />;
};

export default GlobalCpuStatsRing;
