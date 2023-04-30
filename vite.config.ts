import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(require("./package.json").version),
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
