import { createBrowserRouter } from "react-router-dom";
import { Root } from "./routes/layouts/root";
import ErrorPage from "./error-page";

import { Conference } from "./routes/conference";
import { Dashboard } from "./routes/dashboard";
import { Help } from "./routes/help";
import { Agenda } from "./routes/agenda";
import { Scan } from "./routes/scan";
import { Wallet } from "./routes/wallet";
import { Me } from "./routes/me";

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
        path: "/dashboard",
        element: <Dashboard />,
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
        path: "/scan",
        element: <Scan />,
      },
      {
        path: "/wallet",
        element: <Wallet />,
      },
      {
        path: "/me",
        element: <Me />,
      },
    ],
  },
]);

export default router;