export interface ChartProps {
  xAxisMin: number;
}

export interface UniqueNetwork {
  name: string;
  unit: string;
  data: UniqueNetworkData[];
}

export interface UniqueNetworkData {
  received: number;
  timestamp: number;
}

export interface UniqueCpu {
  name: string;
  data: UniqueCpuData[];
}
export interface UniqueCpuData {
  timestamp: number;
  usage: number;
}
