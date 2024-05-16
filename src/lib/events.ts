import { emit } from "@tauri-apps/api/event";

export const setWindowColor = (color: string) => emit("bg-changed", color);
