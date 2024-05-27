import useEnumerableMetricsStore from "@/features/metrics/stores/enumerable-metrics.store";
import { Process, streams } from "@/lib";
import createSelectors from "@/utils/create-selectors";

import { DEFAULT_PROCESS } from "./processes.store";

const useProcessesEnumerableStore = useEnumerableMetricsStore<Process>({
  default: [DEFAULT_PROCESS],
  stream: streams.processes,
  maxSize: 10,
});

useProcessesEnumerableStore.getState().listen();

const useProcessesEnumerableSelectors = createSelectors(useProcessesEnumerableStore);

export default useProcessesEnumerableSelectors;
