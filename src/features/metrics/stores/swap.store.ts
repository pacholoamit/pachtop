import { streams, Swap } from "@/lib";
import createSelectors from "@/utils/create-selectors";

import useMetricsStore from "./metrics.store";

const DEFAULT_SWAP: Swap = {
  free: 0,
  total: 0,
  used: 0,
  usedPercentage: 0,
  timestamp: BigInt(0),
};

const useSwapStore = useMetricsStore<Swap>({
  default: DEFAULT_SWAP,
  stream: streams.swap,
});

useSwapStore.getState().listen();

const useSwapSelectors = createSelectors(useSwapStore);

export default useSwapSelectors;
