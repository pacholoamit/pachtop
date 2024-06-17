import ReactDOM from "react-dom/client";

import App from "@/App";
import { enableAutostart } from "@/lib";
import logger from "@/lib/logger";

import store from "./lib/store";

logger.trace("App started");

store
  .then((s) => {
    s.sessions.increment();
    logger.trace("Session count incremented");
    return s.isFirstRun.get();
  })
  .then((isFirstRun) => {
    logger.trace("First run check: ", isFirstRun);

    if (isFirstRun) {
      logger.trace("Enabling autostart");
      enableAutostart();
    }
  });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
