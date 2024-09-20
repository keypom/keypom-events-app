import { createBrowserRouter } from "react-router-dom";

import { PageNotFound } from "@/404-page";
import { ErrorPage } from "@/error-page";
import { OfflinePage } from "@/offline-page";
import { RootLayout } from "@/routes/layouts/root";
import { ComponentType } from "react";
import Agenda from "./routes/agenda";
import Help from "./routes/help";
import AppLayout from "./routes/layouts/app";
import Me from "./routes/me";
import Leaderboard from "./routes/leaderboard";

const lazyWithOfflineCheck = (
  importCallback: () => Promise<{ default: ComponentType<unknown> }>,
) => {
  return async () => {
    if (!navigator.onLine) {
      // Load the OfflinePage if the user is offline
      return { Component: OfflinePage };
    }
    const { default: Component } = await importCallback();
    return { Component };
  };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      /**
       * Ticketed User Routes
       */
      {
        element: <AppLayout />,
        children: [
          /**
           * Eagerly Loaded App Pages
           */
          {
            index: true,
            element: <Me />,
          },
          {
            path: "/leaderboard",
            element: <Leaderboard />,
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
            path: "/me/admin",
            lazy: async () => {
              if (!navigator.onLine) {
                return { Component: OfflinePage };
              }

              const { AdminAuthProvider } = await import(
                "@/contexts/AdminAuthContext"
              );

              const { AdminDashboard } = await import(
                "@/routes/dashboard/adminDashboard"
              );

              return {
                Component: () => (
                  <AdminAuthProvider>
                    <AdminDashboard />
                  </AdminAuthProvider>
                ),
              };
            },
          },
          {
            path: "/me/admin/attendees",
            lazy: async () => {
              if (!navigator.onLine) {
                return { Component: OfflinePage };
              }

              const { AdminAuthProvider } = await import(
                "@/contexts/AdminAuthContext"
              );

              const { AttendeeManager } = await import(
                "@/routes/dashboard/attendeeManager"
              );

              return {
                Component: () => (
                  <AdminAuthProvider>
                    <AttendeeManager />
                  </AdminAuthProvider>
                ),
              };
            },
          },
          {
            path: "/me/admin/drops",
            lazy: async () => {
              if (!navigator.onLine) {
                return { Component: OfflinePage };
              }

              const { AdminAuthProvider } = await import(
                "@/contexts/AdminAuthContext"
              );

              const { AdminCreateDrop } = await import(
                "@/routes/dashboard/adminCreateDrop"
              );

              return {
                Component: () => (
                  <AdminAuthProvider>
                    <AdminCreateDrop />
                  </AdminAuthProvider>
                ),
              };
            },
          },
          /**
           * Lazily Loaded App Pages, requires event credentials
           */
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
          /**
           * Lazily Loaded Unauthenticated Pages
           */
          {
            path: "/tickets",
            children: [
              {
                path: "ticket/:id",
                lazy: lazyWithOfflineCheck(
                  () => import("@/routes/tickets/ticket"),
                ),
              },
            ],
          },
          {
            path: "/welcome",
            lazy: lazyWithOfflineCheck(() => import("@/routes/welcome")),
          },
          {
            path: "/nameselect",
            lazy: lazyWithOfflineCheck(() => import("@/routes/name-select")),
          },
          /**
           * Sponsor/Admin Routes
           */
          {
            path: "/scan",
            children: [
              {
                path: "tickets",
                lazy: lazyWithOfflineCheck(
                  () => import("@/routes/scan/tickets"),
                ),
              },
            ],
          },
        ],
      },
      /**
       * Sponsor/Admin Routes
       */
      {
        path: "/sponsorDashboard/:id",
        lazy: async () => {
          if (!navigator.onLine) {
            return { Component: OfflinePage };
          }

          const { SponsorDashboard } = await import(
            "@/routes/dashboard/sponsorDashboard"
          );

          return {
            Component: () => <SponsorDashboard />,
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
