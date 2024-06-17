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

console.info(
  "%cPACHTOP IS OPEN SOURCE",
  "margin:8px 0;font-family:sans-serif;font-weight:600;font-size:60px;color:#007dbc;"
);
console.info(
  "%cContribute: https://github.com/pacholoamit/pachtop",
  "margin:8px 0;font-family:sans-serif;font-weight:500;font-size:24px;color:#007dbc;"
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
