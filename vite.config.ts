import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  // resolves polyfills needed by near-api-js
  nodePolyfills({ include: ['http', 'https', 'buffer'] }),],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
