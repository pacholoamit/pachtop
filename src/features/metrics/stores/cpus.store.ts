import { create } from "zustand";

import { Cpu, streams, SysInfo } from "@/lib";
import createSelectors from "@/utils/create-selectors";

const DEFAULT_CPUS: Cpu = {
  name: "unknown",
  usage: 0,
  timestamp: 0,
};
interface CpusState {
  cpus: Cpu[];
  listen: () => void;
}

const useCpusStore = create<CpusState>()((set, get) => ({
  cpus: [{ ...DEFAULT_CPUS }],
  listen: () => streams.cpus((cpus) => set({ cpus })),
}));

useCpusStore.getState().listen();

const useCpusSelectors = createSelectors(useCpusStore);

export default useCpusSelectors;
