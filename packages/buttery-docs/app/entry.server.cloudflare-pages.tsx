// add the beginning of your app entry
import "vite/modulepreload-polyfill";

import {
  ButteryDocsServer,
  type HandleRequestCloudflarePagesRenderFunction,
} from "@buttery/docs/server";
import type { ReactDOMServerReadableStream } from "react-dom/server";
import { renderToReadableStream } from "react-dom/server";
import { App } from "./App";

const ABORT_DELAY = 5000;

export const render: HandleRequestCloudflarePagesRenderFunction = async (
  context,
  responseStatusCode
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  // Render the app to a ReadableStream using React's server renderer
  const stream = (await renderToReadableStream(
    <ButteryDocsServer {...context}>
      <App />
    </ButteryDocsServer>,
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

  // regardless of streaming, we're going to wait on everything since it's just
  // a documentation site. We don't need to over engineer this... yanno?
  await stream.allReady;

  return stream;
};
