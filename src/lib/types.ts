export enum TauriCommand {
  Memory = "get_memory",
}

// typescript interfaces/types from models.rs
export interface Memory {
  unit: string;
  free: number;
  total: number;
  used: number;
  timestamp: string;
}
