import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, json } from "react-router-dom";

import ErrorPage from "./error";
import { ColorRoute } from "./routes/color";
import { FontRoute } from "./routes/font";
import Root from "./routes/root";

import "@buttery/tokens/playground/css";
import "@buttery/tokens/generated/css";
import "@buttery/components/css";
import "./root.css";
import { apiClient } from "./api";

async function getConfig() {
  try {
    const config = await apiClient.config.getLatestConfig();
    return json(config);
  } catch (error) {
    console.log(error);
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    loader: getConfig,
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
