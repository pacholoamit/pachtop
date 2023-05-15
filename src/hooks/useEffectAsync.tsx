import React from "react";

const useEffectAsync = (effect: () => Promise<void>, deps?: React.DependencyList) => {
  React.useEffect(() => {
    effect();
  }, deps);
};

export default useEffectAsync;
