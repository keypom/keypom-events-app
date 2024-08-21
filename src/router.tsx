import { createBrowserRouter } from "react-router-dom";

import { Root } from "@/routes/layouts/root";
import { ErrorPage } from "@/error-page";
import { Conference } from "@/routes/conference";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Conference />,
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
        path: "/wallet/journeys",
        async lazy() {
          const { Journeys } = await import("@/routes/wallet/journeys");
          return { Component: Journeys };
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
