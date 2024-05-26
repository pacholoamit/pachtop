const formatSecondsToReadable = (seconds: number): string => {
  const units = ["s", "m", "h"];
  const factor = 60;

  if (seconds < factor) {
    return `${seconds} s`;
  }

  let unitIndex = 0;
  let value = seconds;

  while (value >= factor && unitIndex < units.length - 1) {
    value /= factor;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
};

export default formatSecondsToReadable;
