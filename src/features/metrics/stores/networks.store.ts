import { Network, streams } from "@/lib";
import createSelectors from "@/utils/create-selectors";

import useMetricsStore from "./metrics.store";

// TODO: Use this as it's not currently being used
const DEFAULT_NETWORK: Network = {
  name: "Unknown",
  received: 0,
  timestamp: BigInt(0),
  transmitted: 0,
};

const useNetworkStore = useMetricsStore<Network[]>({
  default: [DEFAULT_NETWORK],
  stream: streams.network,
});

// useNetworkStore.getState().listen();

const useNetworkSelectors = createSelectors(useNetworkStore);

export default useNetworkSelectors;
