import { ButteryDocsClient } from "@buttery/docs/client";
import ReactDOMClient from "react-dom/client";
import { routes } from "./routes";

ReactDOMClient.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <ButteryDocsClient routes={routes} />
);
