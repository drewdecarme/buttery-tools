import { ButteryLogger } from "@buttery/core/logger";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
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

export const LOG = new ButteryLogger({
  id: "buttery-docs",
  prefix: "buttery:docs:server",
  prefixBgColor: "#812c8d",
  logLevel: "debug",
});

export function createButteryDocsRenderToPipeableStream(routes: RouteObject[]) {
  const { query, dataRoutes } = createStaticHandler(routes);

  return async function render(
    request: Request,
    butteryContext: ButteryDocsServerContext,
    options: RenderToPipeableStreamOptions
  ) {
    try {
      // 1. run actions/loaders to get the routing context with `query`
      LOG.debug("Creating routing context...");
      const routerContext = await query(request);
      LOG.debug("Creating routing context... done.");

      // If `query` returns a Response, send it raw (a route probably a redirected)
      if (routerContext instanceof Response) {
        throw "Unable to process a router context of type Response.";
      }

      // 2. Create a static router for SSR
      LOG.debug("Creating static router...");
      const router = createStaticRouter(dataRoutes, routerContext);
      LOG.debug("Creating static router... done.");

      return renderToPipeableStream(
        <ButteryDocsServer
          {...butteryContext}
          router={router}
          routerContext={routerContext}
        />,
        options
      );
    } catch (error) {
      throw LOG.fatal(
        new Error(`Failed rendering the app using React Router: ${error}`)
      );
    }
  };
}
