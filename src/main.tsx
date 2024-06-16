import ReactDOM from "react-dom/client";

import App from "@/App";
import { enableAutostart } from "@/lib";

import store from "./lib/store";

store
  .then((s) => {
    s.sessions.increment();
    return s.isFirstRun.get();
  })
  .then((isFirstRun) => {
    isFirstRun && enableAutostart();
  });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
