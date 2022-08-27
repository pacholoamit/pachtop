export enum TauriCommand {
  Memory = "get_memory",
}

// typescript interfaces/types from models.rs
export interface Memory {
  free: ByteUnitValue;
  total: ByteUnitValue;
  used: ByteUnitValue;
  timestamp: ByteUnitValue;
}

export interface ByteUnitValue {
  value: number;
  unit: string;
}
