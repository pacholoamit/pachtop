import ReactDOM from "react-dom/client";

import App from "@/App";
import { enableAutostart } from "@/lib";

import store from "./lib/store";

store.isFirstRun.get().then((isFirstRun) => {
  isFirstRun && enableAutostart();
});

store.sessions.increment();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
