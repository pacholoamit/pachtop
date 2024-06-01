import { GlobalCpu, streams } from '@/lib';
import createSelectors from '@/utils/create-selectors';

import useMetricsStore from './metrics.store';

const DEFAULT_GLOBAL_CPU: GlobalCpu = {
  brand: "unknown",
  frequency: BigInt(0),
  name: "unknown",
  timestamp: 0,
  usage: 0,
  vendor: "unknown",
};

const useGlobalCpuStore = useMetricsStore<GlobalCpu>({
  default: DEFAULT_GLOBAL_CPU,
  stream: streams.globalCpu,
});

useGlobalCpuStore.getState().listen();

const useGlobalCpuSelectors = createSelectors(useGlobalCpuStore);

export default useGlobalCpuSelectors;
