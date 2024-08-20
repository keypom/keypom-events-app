import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),nodePolyfills()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  define: {
    'process.env': {},
  },
  build: {
    rollupOptions: {
      plugins: [
        // This plugin fixes the "Cannot read properties of undefined (reading 'from')" error
        {
          name: 'replace-buffer',
          transform(code, id) {
            if (id.includes('node_modules/safe-buffer/index.js')) {
              return code.replace("var buffer = require('buffer')", "var buffer = require('buffer/')");
            }
          },
        },
      ],
    },
  },
});
