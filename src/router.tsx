import { createBrowserRouter } from "react-router-dom";

import { PageNotFound } from "@/404-page";
import { ErrorPage } from "@/error-page";
import { OfflinePage } from "@/offline-page";
import Agenda from "@/routes/agenda";
import { Root } from "@/routes/layouts/root";
import { ComponentType } from "react";
import Help from "./routes/help";
import Me from "./routes/me";
import AppLayout from "./routes/layouts/app";

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
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Me />,
          },
          {
            path: "/me",
            element: <Me />,
          },
          {
            path: "/help",
            element: <Help />,
          },
          {
            path: "/agenda",
            element: <Agenda />,
          },
          {
            path: "/alerts",
            lazy: lazyWithOfflineCheck(() => import("@/routes/alerts")),
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
            lazy: lazyWithOfflineCheck(
              () => import("@/routes/wallet/journeys"),
            ),
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
        path: "/app",
        lazy: lazyWithOfflineCheck(
          () => import("@/routes/conference/conferencePageManager"),
        ),
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
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
