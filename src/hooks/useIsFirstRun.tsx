import { useState } from "react";

import useEffectAsync from "@/hooks/useEffectAsync";
import store from "@/lib/store";

const useIsFirstRun = () => {
  const [isFirstRun, setIsFirstRun] = useState(false);

  useEffectAsync(async () => {
    const firstRun = await store.then((s) => s.isFirstRun.get());
    setIsFirstRun(firstRun);
  }, []);

  return isFirstRun;
};

export default useIsFirstRun;
