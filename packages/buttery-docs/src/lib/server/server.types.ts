import type { ReactDOMServerReadableStream } from "react-dom/server";
import type { ButteryDocsContext } from "./ButteryDocsServer";

export type HandleRequestCloudflarePagesRenderFunction = (
  butteryContext: ButteryDocsContext,
  responseStatusCode: number
) => Promise<ReactDOMServerReadableStream>;
