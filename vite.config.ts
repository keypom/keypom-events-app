import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite"; // loadEnv to load environment variables

import { nodePolyfills } from "vite-plugin-node-polyfills";

const REQUIRED_ENV_VARS = [
  "VITE_CONTRACT_ID",
  "VITE_NETWORK_ID",
  "VITE_AIRTABLE_WORKER_URL",
  "VITE_IPFS_WORKER_URL",
  "VITE_GOOGLE_CLIENT_ID",
];

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  // Load environment variables based on the current mode (e.g., 'development' or 'production')
  const env = loadEnv(mode, process.cwd(), "");

  // Check for required environment variables
  REQUIRED_ENV_VARS.forEach((envVar) => {
    if (!env[envVar]) {
      throw new Error(`Missing env var: ${envVar}`);
    }
  });

  return defineConfig({
    plugins: [react(), nodePolyfills({ include: ["http", "https", "buffer"] })],
    server: {
      port: 5173,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "@keypom/core"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  });
};
