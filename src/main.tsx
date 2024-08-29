import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

async function prepare() {
  // if (import.meta.env.DEV) { // going to mock in both dev and prod

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
