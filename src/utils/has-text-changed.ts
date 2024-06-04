import formatBytes from "@/features/metrics/utils/format-bytes";

const hasBytesTextChanged = (prevBytes: number, nextBytes: number, toFixed: number = 2): boolean => {
  return formatBytes(prevBytes, toFixed) !== formatBytes(nextBytes, toFixed);
};

export default hasBytesTextChanged;
