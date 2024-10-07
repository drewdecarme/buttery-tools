import { StrictMode } from "react";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppRoutes from "./App";

export async function render(
  url: string,
  _ssrManifest?: string,
  options?: RenderToPipeableStreamOptions
) {
  // Render the app to a ReadableStream using React's server renderer
  return renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
    options
  );
}
