import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    return worker.start({
      onUnhandledRequest(req, print) {
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
}

prepare().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
