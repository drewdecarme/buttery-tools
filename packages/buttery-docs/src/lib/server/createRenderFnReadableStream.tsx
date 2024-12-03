import {
  type ReactDOMServerReadableStream,
  renderToReadableStream,
} from "react-dom/server";
import {
  type RouteObject,
  createStaticHandler,
  createStaticRouter,
} from "react-router";
import {
  ButteryDocsServer,
  type ButteryDocsServerContext,
} from "./ButteryDocsServer";

const ABORT_DELAY = 5000;

export function createButteryDocsRenderToReadableStream(routes: RouteObject[]) {
  const { query, dataRoutes } = createStaticHandler(routes);

  return async function render(
    request: Request,
    butteryContext: ButteryDocsServerContext,
    responseStatusCode: number
  ) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

    // 1. run actions/loaders to get the routing context with `query`
    const routerContext = await query(request);

    // If `query` returns a Response, send it raw (a route probably a redirected)
    if (routerContext instanceof Response) {
      return routerContext;
    }

    // 2. Create a static router for SSR
    const router = createStaticRouter(dataRoutes, routerContext);

    // Render the app to a ReadableStream using React's server renderer
    const stream = (await renderToReadableStream(
      <ButteryDocsServer
        {...butteryContext}
        router={router}
        routerContext={routerContext}
      />,
      {
        signal: controller.signal,
        onError(error: unknown) {
          if (!controller.signal.aborted) {
            // Log streaming rendering errors from inside the shell
            console.error(error, responseStatusCode);
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
}
