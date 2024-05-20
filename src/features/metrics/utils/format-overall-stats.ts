import formatBytes from './format-bytes';

const formatOverallStats = (used: number, total: number) => {
  const usedFormatted = formatBytes(used);
  const totalFormatted = formatBytes(total);

  return `${usedFormatted} / ${totalFormatted}`;
};

export default formatOverallStats;
