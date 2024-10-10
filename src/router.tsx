import { createBrowserRouter } from "react-router-dom";

import { PageNotFound } from "@/404-page";
import { ErrorPage } from "@/error-page";
import { OfflinePage } from "@/offline-page";
import { RootLayout } from "@/routes/layouts/root";
import Agenda from "./routes/agenda";
import Help from "./routes/help";
import AppLayout from "./routes/layouts/app";
import Me from "./routes/me";

const lazyWithOfflineCheck = (importCallback) => {
  return async () => {
    try {
      if (!navigator.onLine) {
        return { Component: OfflinePage };
      }
      const { default: Component } = await importCallback();
      return { Component };
    } catch (error) {
      console.error("Failed to load component:", error);
      return { Component: OfflinePage }; // Show fallback on error
    }
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
          /**
           * Lazily Loaded Pages
           */
          {
            path: "/leaderboard",
            lazy: lazyWithOfflineCheck(
              () => import("@/routes/leaderboard/leaderboard"),
            ),
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
            lazy: lazyWithOfflineCheck(async () => {
              const { AdminAuthProvider } = await import(
                "@/contexts/AdminAuthContext"
              );

              const { AdminDashboard } = await import(
                "@/routes/dashboard/adminDashboard"
              );

              return {
                default: () => (
                  <AdminAuthProvider>
                    <AdminDashboard />
                  </AdminAuthProvider>
                ),
              };
            }),
          },
          {
            path: "/me/admin/attendees",
            lazy: lazyWithOfflineCheck(async () => {
              const { AdminAuthProvider } = await import(
                "@/contexts/AdminAuthContext"
              );

              const { AttendeeManager } = await import(
                "@/routes/dashboard/attendeeManager"
              );

              return {
                default: () => (
                  <AdminAuthProvider>
                    <AttendeeManager />
                  </AdminAuthProvider>
                ),
              };
            }),
          },
          {
            path: "/me/admin/drops",
            lazy: lazyWithOfflineCheck(async () => {
              const { AdminAuthProvider } = await import(
                "@/contexts/AdminAuthContext"
              );

              const { AdminCreateDrop } = await import(
                "@/routes/dashboard/adminCreateDrop"
              );

              return {
                default: () => (
                  <AdminAuthProvider>
                    <AdminCreateDrop />
                  </AdminAuthProvider>
                ),
              };
            }),
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
          /**
           * Conference Over Page
           */
          {
            path: "/offboarding",
            lazy: lazyWithOfflineCheck(() => import("@/routes/offboarding")),
          },
        ],
      },
      /**
       * Sponsor/Admin Routes
       */
      {
        path: "/sponsorDashboard/:id",
        lazy: lazyWithOfflineCheck(
          () => import("@/routes/dashboard/sponsorDashboard"),
        ),
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
