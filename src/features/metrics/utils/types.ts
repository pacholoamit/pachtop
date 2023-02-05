import { Cpu, Disk, Network } from "@/lib/types";

export interface ChartProps {
  xAxisMin?: number;
}

export interface UniqueNetwork {
  name: string;
  data: UniqueNetworkData[];
}

export interface UniqueNetworkData extends Network { }

export interface UniqueCpu {
  name: string;
  data: UniqueCpuData[];
}
export interface UniqueCpuData extends Cpu { }

export interface UniqueDisk {
  id: string;
  data: UniqueDiskData[];
}

export interface UniqueDiskData extends Disk { }


