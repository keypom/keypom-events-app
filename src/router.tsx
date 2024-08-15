import { createBrowserRouter } from "react-router-dom";
import { Conference } from "./routes/conference";
import { Root } from "./routes/layouts/root";
import ErrorPage from "./error-page";
import { Dashboard } from "./routes/dashboard";

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
    ],
  },
]);

export default router;
