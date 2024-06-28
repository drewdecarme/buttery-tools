import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ErrorPage from "./error";
import { ColorRoute } from "./routes/color";
import { FontRoute } from "./routes/font";
import Root from "./routes/root";

import "#buttery/tokens/playground/css";
import "./root.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "color",
        element: <ColorRoute />,
      },
      {
        path: "font",
        element: <FontRoute />,
      },
    ],
  },
]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);