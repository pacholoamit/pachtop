export enum TauriCommand {
  Memory = "get_memory",
  Swap = "get_swap",
}

// typescript interfaces/types from models.rs
export interface Memory {
  unit: string;
  free: number;
  total: number;
  used: number;
  timestamp: number;
}

export interface Swap {
  unit: string;
  free: number;
  total: number;
  used: number;
  timestamp: number;
}
