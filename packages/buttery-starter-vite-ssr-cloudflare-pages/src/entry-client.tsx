import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

ReactDOMClient.hydrateRoot(
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  document.getElementById("root")!,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
