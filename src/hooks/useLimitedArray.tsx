import { useState } from "react";

const useLimitedArray = <T,>(maxSize: number) => {
  const [array, setArray] = useState<T[]>([]);

  function pushLimited(item: T) {
    if (array.length >= maxSize) {
      array.pop();
    }
    setArray((prev) => [...prev, item]);
  }

  return [array, pushLimited] as const;
};

export default useLimitedArray;
