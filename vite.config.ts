import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// custom plugins
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // resolves polyfills needed by near-api-js
    nodePolyfills({ include: ["http", "https", "buffer"] }),
    // pwa
    VitePWA({ registerType: "autoUpdate", devOptions: { enabled: true } }),
  ],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
