import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, PluginOption } from "vite";

// custom plugins
import { nodePolyfills } from "vite-plugin-node-polyfills";
// import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // resolves polyfills needed by near-api-js
    nodePolyfills({ include: ["http", "https", "buffer"] }),
    // pwa
    // VitePWA({
    //   registerType: "autoUpdate",
    //   workbox: {
    //     navigateFallbackDenylist: [/^\/dashboard/],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'google-fonts-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200]
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'images-cache',
    //           expiration: {
    //             maxEntries: 60,
    //             maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /\.(?:js|css)$/,
    //         handler: 'StaleWhileRevalidate',
    //         options: {
    //           cacheName: 'static-resources',
    //           expiration: {
    //             maxEntries: 60,
    //             maxAgeSeconds: 24 * 60 * 60 // 24 hours
    //           }
    //         }
    //       }
    //     ]
    //   },
    //   includeAssets: [
    //     "favicon.ico",
    //     "apple-touch-icon.png",
    //     "mask-icon.svg",
    //   ],
    //   manifest: {
    //     name: "Keypom [Redacted] Event App",
    //     short_name: "Redacted",
    //     description: "Modular PWA with Keypom ticketing for Redacted Event",
    //     theme_color: "#000000",
    //     icons: [
    //       {
    //         src: "pwa-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "pwa-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    // }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,
  ],
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
          vendor: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
