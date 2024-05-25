const formatBytes = (bytes: number, toFixed: number = 2): string => {
  if (bytes < 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const factor = 1024;

  if (bytes < factor) {
    return `${bytes} B`;
  }

  let unitIndex = 0;
  let value = bytes;

  while (value >= factor && unitIndex < units.length - 1) {
    value /= factor;
    unitIndex++;
  }

  return `${value.toFixed(toFixed)} ${units[unitIndex]}`;
};

export default formatBytes;
