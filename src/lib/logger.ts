import { error, info, trace } from "@tauri-apps/plugin-log";

const parseMsgToString = (message: unknown | unknown[]): string => {
  if (typeof message === "string" || typeof message === "number") {
    return message.toString();
  } else if (Array.isArray(message)) {
    return message.map(parseMsgToString).join(" ");
  } else {
    return JSON.stringify(message, null, 2);
  }
};

const createLogger = (name: string) => {
  return {
    info: (...message: unknown[]) => info(name + " : " + parseMsgToString(message)),
    error: (...message: unknown[]) => error(name + " : " + parseMsgToString(message)),
    trace: (...message: unknown[]) => trace(name + " : " + parseMsgToString(message)),
  };
};

const logger = createLogger("Pachtop");

export default logger;
