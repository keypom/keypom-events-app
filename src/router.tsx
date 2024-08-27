import { createBrowserRouter } from "react-router-dom";

import { ErrorPage } from "@/error-page";
import { Root } from "@/routes/layouts/root";
import { OfflinePage } from "@/offline-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Conference } = await import("@/routes/conference");
          return { Component: Conference };
        },
      },
      {
        path: "/help",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Help } = await import("@/routes/help");
          return { Component: Help };
        },
      },
      {
        path: "/agenda",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Agenda } = await import("@/routes/agenda");
          return { Component: Agenda };
        },
      },
      {
        path: "/scan",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Scan } = await import("@/routes/scan");
          return { Component: Scan };
        },
      },
      {
        path: "/scan/:data",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Claim } = await import("@/routes/scan/claim");
          return { Component: Claim };
        },
      },
      {
        path: "/wallet",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Wallet } = await import("@/routes/wallet");
          return { Component: Wallet };
        },
      },
      {
        path: "/wallet/collectibles",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Collectibles } = await import("@/routes/wallet/collectibles");
          return { Component: Collectibles };
        },
      },
      {
        path: "/wallet/collectibles/:id",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { CollectiblePage } = await import(
            "@/routes/wallet/collectibles/collectible"
          );
          return { Component: CollectiblePage };
        },
      },
      {
        path: "/wallet/journeys",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Journeys } = await import("@/routes/wallet/journeys");
          return { Component: Journeys };
        },
      },
      {
        path: "/wallet/journeys/:id",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { JourneyPage } = await import(
            "@/routes/wallet/journeys/journey"
          );
          return { Component: JourneyPage };
        },
      },
      {
        path: "/wallet/send",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Send } = await import("@/routes/wallet/send");
          return { Component: Send };
        },
      },
      {
        path: "/wallet/receive",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Receive } = await import("@/routes/wallet/receive");
          return { Component: Receive };
        },
      },
      {
        path: "/me",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Me } = await import("@/routes/me");
          return { Component: Me };
        },
      },
      {
        path: "/alerts",
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Alerts } = await import("@/routes/alerts");
          return { Component: Alerts };
        },
      },
    ],
  },
  {
    path: "/dashboard",
    async lazy() {
      if (!navigator.onLine) {
        return { Component: OfflinePage };
      }
      const { Dashboard } = await import("@/routes/dashboard");
      return { Component: Dashboard };
    },
  },
]);

export default router;
