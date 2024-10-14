import { ButteryMetaProvider } from "@buttery/meta/react";
import { StrictMode } from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

ReactDOMClient.hydrateRoot(
  document.body,
  <StrictMode>
    <ButteryMetaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ButteryMetaProvider>
  </StrictMode>
);
