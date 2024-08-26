import { createBrowserRouter } from "react-router-dom";

import { Root } from "@/routes/layouts/root";
import { ErrorPage } from "@/error-page";

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
          const { Conference } = await import("@/routes/conference");
          return { Component: Conference };
        },
      },
      {
        path: "/help",
        async lazy() {
          const { Help } = await import("@/routes/help");
          return { Component: Help };
        },
      },
      {
        path: "/agenda",
        async lazy() {
          const { Agenda } = await import("@/routes/agenda");
          return { Component: Agenda };
        },
      },
      {
        path: "/scan",
        async lazy() {
          const { Scan } = await import("@/routes/scan");
          return { Component: Scan };
        },
      },
      {
        path: "/scan/:data",
        async lazy() {
          const { Claim } = await import("@/routes/scan/claim");
          return { Component: Claim };
        },
      },
      {
        path: "/wallet",
        async lazy() {
          const { Wallet } = await import("@/routes/wallet");
          return { Component: Wallet };
        },
      },
      {
        path: "/wallet/collectibles",
        async lazy() {
          const { Collectibles } = await import("@/routes/wallet/collectibles");
          return { Component: Collectibles };
        },
      },
      {
        path: "/wallet/collectibles/:id",
        async lazy() {
          const { CollectiblePage } = await import(
            "@/routes/wallet/collectibles/collectible"
          );
          return { Component: CollectiblePage };
        },
      },
      {
        path: "/wallet/journeys",
        async lazy() {
          const { Journeys } = await import("@/routes/wallet/journeys");
          return { Component: Journeys };
        },
      },
      {
        path: "/wallet/journeys/:id",
        async lazy() {
          const { JourneyPage } = await import(
            "@/routes/wallet/journeys/journey"
          );
          return { Component: JourneyPage };
        },
      },
      {
        path: "/wallet/send",
        async lazy() {
          const { Send } = await import("@/routes/wallet/send");
          return { Component: Send };
        },
      },
      {
        path: "/wallet/receive",
        async lazy() {
          const { Receive } = await import("@/routes/wallet/receive");
          return { Component: Receive };
        },
      },
      {
        path: "/me",
        async lazy() {
          const { Me } = await import("@/routes/me");
          return { Component: Me };
        },
      },
      {
        path: "/alerts",
        async lazy() {
          const { Alerts } = await import("@/routes/alerts");
          return { Component: Alerts };
        },
      },
    ],
  },
  {
    path: "/dashboard",
    async lazy() {
      const { Dashboard } = await import("@/routes/dashboard");
      return { Component: Dashboard };
    },
  },
]);

export default router;
