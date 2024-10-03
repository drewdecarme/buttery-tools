import { StrictMode } from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./AppRoutes";

ReactDOMClient.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
