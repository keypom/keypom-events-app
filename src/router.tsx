import { createBrowserRouter } from "react-router-dom";

import { ErrorPage } from "@/error-page";
import { OfflinePage } from "@/offline-page";
import { Root } from "@/routes/layouts/root";
import { ComponentType } from "react";
import { PageNotFound } from "@/404-page";

const lazyWithOfflineCheck = (
  importCallback: () => Promise<{ default: ComponentType<unknown> }>,
) => {
  return async () => {
    if (!navigator.onLine) {
      return { Component: OfflinePage };
    }
    const { default: Component } = await importCallback();
    return { Component };
  };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        lazy: lazyWithOfflineCheck(() => import("@/routes/home")),
      },
      {
        path: "/app",
        lazy: lazyWithOfflineCheck(
          () => import("@/routes/conference/conferencePageManager"),
        ),
      },
      {
        path: "/help",
        lazy: lazyWithOfflineCheck(() => import("@/routes/help")),
      },
      {
        path: "/agenda",
        lazy: lazyWithOfflineCheck(() => import("@/routes/agenda")),
      },
      {
        path: "/scan",
        lazy: lazyWithOfflineCheck(() => import("@/routes/scan")),
      },
      {
        path: "/scan/:data",
        lazy: lazyWithOfflineCheck(() => import("@/routes/scan/claim")),
      },
      {
        path: "/scan",
        children: [
          {
            path: "event/:funderAndEventId",
            lazy: lazyWithOfflineCheck(
              () => import("@/routes/adminScan/adminScan"),
            ),
          },
        ],
      },
      {
        path: "/wallet",
        lazy: lazyWithOfflineCheck(() => import("@/routes/wallet")),
      },
      {
        path: "/wallet/collectibles",
        lazy: lazyWithOfflineCheck(
          () => import("@/routes/wallet/collectibles"),
        ),
      },
      {
        path: "/wallet/collectibles/:id",
        lazy: lazyWithOfflineCheck(
          () => import("@/routes/wallet/collectibles/collectible"),
        ),
      },
      {
        path: "/wallet/journeys",
        lazy: lazyWithOfflineCheck(() => import("@/routes/wallet/journeys")),
      },
      {
        path: "/wallet/journeys/:id",
        lazy: lazyWithOfflineCheck(
          () => import("@/routes/wallet/journeys/journey"),
        ),
      },
      {
        path: "/wallet/send",
        lazy: lazyWithOfflineCheck(() => import("@/routes/wallet/send")),
      },
      {
        path: "/wallet/receive",
        lazy: lazyWithOfflineCheck(() => import("@/routes/wallet/receive")),
      },
      {
        path: "/me",
        lazy: lazyWithOfflineCheck(() => import("@/routes/me")),
      },
      {
        path: "/alerts",
        lazy: lazyWithOfflineCheck(() => import("@/routes/alerts")),
      },
      {
        path: "/tickets",
        children: [
          {
            path: "ticket/:id", // Match /events/event/:id
            lazy: lazyWithOfflineCheck(() => import("@/routes/tickets/ticket")),
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    lazy: async () => {
      if (!navigator.onLine) {
        return { Component: OfflinePage };
      }

      const { AuthWalletContextProvider } = await import(
        "@/contexts/AuthWalletContext"
      );
      const { Dashboard } = await import("@/routes/dashboard");

      return {
        Component: () => (
          <AuthWalletContextProvider>
            <Dashboard />
          </AuthWalletContextProvider>
        ),
      };
    },
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
