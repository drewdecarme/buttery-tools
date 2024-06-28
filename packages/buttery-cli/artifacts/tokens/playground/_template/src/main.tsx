import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ErrorPage from "./error";
import { ColorRoute } from "./routes/color";
import { FontRoute } from "./routes/font";
import Root from "./routes/root";

import "#buttery/tokens/playground/css";
import "#buttery/tokens/generated/css";
import "./root.css";
import { config } from "./token-config";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "color",
        loader: () => {
          return Array.isArray(config.tokens)
            ? config.tokens[0].color
            : config.tokens.color;
        },
        element: <ColorRoute />,
      },
      {
        path: "font",
        loader: () => {
          return Array.isArray(config.tokens)
            ? config.tokens[0].font
            : config.tokens.font;
        },
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
