import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

hydrateRoot(
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  document.getElementById("root")!,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
