import formatBytes from "./format-bytes";

const formatOverallStats = (used: number, total: number, toFixed: number = 2) => {
  const usedFormatted = formatBytes(used, toFixed);
  const totalFormatted = formatBytes(total, toFixed);

  return `${usedFormatted} / ${totalFormatted}`;
};

export default formatOverallStats;
