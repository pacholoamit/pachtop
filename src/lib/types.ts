export enum TauriCommand {
  Memory = "get_memory",
}

export interface Memory {
  free: number;
  total: number;
  used: number;
  timestamp: number;
}
