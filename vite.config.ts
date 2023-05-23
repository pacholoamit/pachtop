import { defineConfig, optimizeDeps } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  plugins: [
    react(),

    mdx({
      remarkPlugins: [],
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
