import { trace, info, error, warn, attachConsole } from "tauri-plugin-log-api";

const createLogger = async () => {
  await attachConsole();
  return {
    trace,
    info,
    warn,
    error,
  };
};

const logger = createLogger();

export default logger;
