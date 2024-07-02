import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, json } from "react-router-dom";

import ErrorPage from "./error";
import { ColorRoute } from "./routes/color";
import { FontRoute } from "./routes/font";
import Root from "./routes/root";

import "#buttery/tokens/playground/css";
import "#buttery/tokens/generated/css";
import "./root.css";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ButteryConfigTokens } from "@buttery/core";

const configDir = path.resolve(import.meta.dirname, "./configs");

async function getConfig(): Promise<ButteryConfigTokens> {
  try {
    const configPath = path.resolve(configDir, "./config.json");
    const configFile = await readFile(configPath, "utf8");
    const configJson = JSON.parse(configFile);
    return configJson as ButteryConfigTokens;
  } catch (error) {
    throw "Cannot locate / parse config JSON";
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "color",
        loader: async () => {
          try {
            const config = await getConfig();
            return json({ config });
          } catch (error) {}
        },
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
