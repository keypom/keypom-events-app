import { createBrowserRouter } from "react-router-dom";
import { Home } from "./routes/home";
import { Root } from "./routes/layouts/root";
import ErrorPage from "./error-page";
import { Conference } from "./routes/conference";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/conference",
        element: <Conference />,
      },
    ],
  },
]);

export default router;
