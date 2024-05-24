import { Network, streams } from "@/lib";
import createSelectors from "@/utils/create-selectors";

import useEnumerableMetricsStore from "./enumerable-metrics.store";

const DEFAULT_NETWORK: Network = {
  name: "Unknown",
  received: 0,
  timestamp: BigInt(0),
  transmitted: 0,
};

const useNetworkStore = useEnumerableMetricsStore<Network[]>({
  default: [DEFAULT_NETWORK],
  stream: streams.network,
});

useNetworkStore.getState().listen();

const useNetworkSelectors = createSelectors(useNetworkStore);

export default useNetworkSelectors;
