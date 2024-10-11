import { StrictMode } from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DocumentMetaProvider } from "../../utils/DocumentMeta.context";
import AppRoutes from "./App";

ReactDOMClient.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <DocumentMetaProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DocumentMetaProvider>
  </StrictMode>
);
