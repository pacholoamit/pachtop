import { Memory, streams } from "@/lib";
import createSelectors from "@/utils/create-selectors";

import useMetricsStore from "./metrics.store";

const DEFAULT_MEMORY: Memory = {
  free: 0,
  timestamp: BigInt(0),
  total: 0,
  used: 0,
  usedPercentage: 0,
};

const useMemoryStore = useMetricsStore<Memory>({
  default: DEFAULT_MEMORY,
  stream: streams.memory,
});

useMemoryStore.getState().listen();

const useMemorySelectors = createSelectors(useMemoryStore);

export default useMemorySelectors;
