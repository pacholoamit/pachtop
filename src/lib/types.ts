export enum TauriCommand {
  Memory = "memory",
}

export interface Memory {
  free: number;
  total: number;
  used: number;
  timestamp: number;
}
