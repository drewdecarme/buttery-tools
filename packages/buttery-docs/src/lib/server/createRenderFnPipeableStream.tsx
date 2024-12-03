import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { type RouteObject, createStaticHandler } from "react-router";
import {
  ButteryDocsServer,
  type ButteryDocsServerContext,
} from "./ButteryDocsServer";
import { createRouterFromRoutes } from "./createRouterFromRoutes";
import { LOG_SERVER } from "./server.utils";

export function createButteryDocsRenderToPipeableStream(routes: RouteObject[]) {
  const handler = createStaticHandler(routes);

  return async function render(
    request: Request,
    butteryContext: ButteryDocsServerContext,
    options: RenderToPipeableStreamOptions
  ) {
    const router = await createRouterFromRoutes(handler, request);

    LOG_SERVER.debug("Rendering app to pipeable stream");
    return renderToPipeableStream(
      <ButteryDocsServer {...butteryContext} {...router} />,
      options
    );
  };
}
