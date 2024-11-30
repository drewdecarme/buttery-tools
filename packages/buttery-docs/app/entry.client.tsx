import { ButteryDocsClient } from "@buttery/docs/client";
import ReactDOMClient from "react-dom/client";
import { ButteryDocsApp } from "./entry.app";

ReactDOMClient.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <ButteryDocsClient>
    <ButteryDocsApp />
  </ButteryDocsClient>
);
