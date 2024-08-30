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
        path: "/:id",
        index: true,
        async lazy() {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }
          const { Home } = await import("@/routes/home");
          return { Component: Home };
        },
      },
      {
        path: "/help",
        // TODO: Show cached help page
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
          // TODO: Show cached agenda page
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
        path: "/scan",
        children: [
          {
            path: "event/:funderAndEventId",
            async lazy() {
              if (!navigator.onLine) {
                return { Component: OfflinePage };
              }
              const { Scanner } = await import("@/routes/adminScan/adminScan");
              return { Component: Scanner };
            },
          },
        ],
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
      {
        path: "/tickets",
        children: [
          {
            path: "ticket/:id", // Match /events/event/:id
            async lazy() {
              if (!navigator.onLine) {
                return { Component: OfflinePage };
              }
              const { TicketPage } = await import(
                "@/routes/tickets/ticketPage"
              );
              return { Component: TicketPage };
            },
          },
        ],
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
