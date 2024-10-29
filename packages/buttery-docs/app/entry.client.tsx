import { ButteryDocsClient } from "@buttery/docs/client";
import ReactDOMClient from "react-dom/client";
import { App } from "./App";

ReactDOMClient.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <ButteryDocsClient>
    <App />
  </ButteryDocsClient>
);
