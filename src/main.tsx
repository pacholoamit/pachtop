import ReactDOM from "react-dom/client";

import App from "@/App";

import { commands, enableAutostart } from "./lib";
import store from "./lib/store";

await store.isFirstRun.get().then((isFirstRun) => {
  if (isFirstRun === null) {
    console.log("First run detected, setting up defaults");
    store.isFirstRun.set(true);
  }
  if (isFirstRun === false) return;

  enableAutostart();
  commands.add_pachtop_exclusion();
  store.isFirstRun.set(false);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
