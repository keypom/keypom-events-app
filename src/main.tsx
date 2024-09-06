import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { isTestEnv } from "./constants/common";

async function prepare() {
  // Skip if in test environment
  if (isTestEnv) {
    console.log("Skipping mock service worker in test environment");
    return;
  }

  console.log("Starting mock service worker");
  const { worker } = await import("@/mocks/browser");

  return worker.start({
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
    onUnhandledRequest(req, print) {
      // Workaround: passthrough all when in production
      if (!import.meta.env.DEV) return;
      // Ignore routing requests
      if (req.url.startsWith(window.location.origin)) return;
      // Ignore font requests
      if (
        req.url.startsWith("https://fonts.googleapis.com") ||
        req.url.startsWith("https://fonts.gstatic.com")
      )
        return;

      // Ignore RPC requests
      if (req.url.startsWith("https://rpc.testnet.near.org/")) return;

      print.warning();
    },
  });
}

prepare().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
