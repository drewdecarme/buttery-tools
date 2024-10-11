import { StrictMode } from "react";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { DocumentMeta } from "../../utils/DocumentMeta";
import { DocumentMetaProvider } from "../../utils/DocumentMeta.context";
import AppRoutes from "./App";

export async function render(
  url: string,
  DocumentMeta: DocumentMeta,
  _ssrManifest?: string,
  options?: RenderToPipeableStreamOptions
) {
  // Render the app to a ReadableStream using React's server renderer
  return renderToPipeableStream(
    <StrictMode>
      <DocumentMetaProvider Meta={DocumentMeta}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </DocumentMetaProvider>
    </StrictMode>,
    options
  );
}
