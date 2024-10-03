import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@buttery/tokens/docs/css";

ReactDOMClient.hydrateRoot(
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  document.getElementById("root")!,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
