// add the beginning of your app entry
import "vite/modulepreload-polyfill";

import type { ButteryMeta } from "@buttery/meta";
import { ButteryMetaProvider } from "@buttery/meta/react";
import { StrictMode } from "react";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "./App";

export async function render(
  url: string,
  ButteryMeta: ButteryMeta,
  _ssrManifest?: string,
  options?: RenderToPipeableStreamOptions
) {
  // Render the app to a ReadableStream using React's server renderer
  return renderToPipeableStream(
    <StrictMode>
      <ButteryMetaProvider ButteryMeta={ButteryMeta}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </ButteryMetaProvider>
    </StrictMode>,
    options
  );
}
