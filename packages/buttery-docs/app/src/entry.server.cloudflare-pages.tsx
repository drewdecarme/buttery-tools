// add the beginning of your app entry
import "vite/modulepreload-polyfill";

import type { ButteryMeta } from "@buttery/meta";
import { ButteryMetaProvider } from "@buttery/meta/react";
import { StrictMode } from "react";
import type { ReactDOMServerReadableStream } from "react-dom/server";
import { renderToReadableStream } from "react-dom/server.browser";
import { StaticRouter } from "react-router-dom/server";
import { App } from "./App";

const ABORT_DELAY = 5000;

export async function render(
  route: string,
  responseStatusCode: number,
  ButteryMeta: ButteryMeta
): Promise<ReactDOMServerReadableStream> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  // Render the app to a ReadableStream using React's server renderer
  const stream = (await renderToReadableStream(
    <StrictMode>
      <ButteryMetaProvider ButteryMeta={ButteryMeta}>
        <StaticRouter location={route}>
          <App />
        </StaticRouter>
      </ButteryMetaProvider>
    </StrictMode>,
    {
      signal: controller.signal,
      onError(error: unknown) {
        if (!controller.signal.aborted) {
          // Log streaming rendering errors from inside the shell
          console.error(error);
        }
        responseStatusCode = 500;
      },
    }
  )) as ReactDOMServerReadableStream;

  stream.allReady.then(() => clearTimeout(timeoutId));

  await stream.allReady;

  return stream;
}
