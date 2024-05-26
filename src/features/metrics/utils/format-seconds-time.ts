const formatSecondsToReadable = (seconds: number): string => {
  const factor = 60;
  const hours = Math.floor(seconds / (factor * factor));
  const minutes = Math.floor((seconds % (factor * factor)) / factor);
  // Exclude seconds calculation
  // const remainingSeconds = seconds % factor;

  let result = "";

  if (hours > 0) {
    result += `${hours} hr${hours > 1 ? "s" : ""}`;
    if (minutes > 0) {
      result += ` and ${minutes} min${minutes > 1 ? "s" : ""}`;
    }
  } else {
    if (minutes > 0) {
      result += `${minutes} min${minutes > 1 ? "s" : ""}`;
    } else {
      result += `${seconds} sec${seconds > 1 ? "s" : ""}`;
    }
  }

  return result;
};

export default formatSecondsToReadable;
