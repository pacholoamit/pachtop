import formatBytes from "./format-bytes";

const formatStats = (used: number, toFixed: number = 2) => {
  const usedFormatted = formatBytes(used, toFixed);

  return `${usedFormatted}`;
};

export default formatStats;
