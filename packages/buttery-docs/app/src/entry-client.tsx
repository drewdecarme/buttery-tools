import { ButteryMetaProvider } from "@buttery/meta/react";
import { StrictMode } from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./App";

ReactDOMClient.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <ButteryMetaProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ButteryMetaProvider>
  </StrictMode>
);
