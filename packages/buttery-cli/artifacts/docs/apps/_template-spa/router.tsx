import { type RouteObject, createBrowserRouter } from "react-router-dom";
// @ts-expect-error data is created dynamically via the `dev` CLI command
import { graph, header } from "./data";
import DocsRoute from "./routes/docs";
import RootRoute from "./routes/root";
import type { ButteryDocsGraph } from ".buttery/commands/docs/docs.types";

const createRoute = (graph: ButteryDocsGraph): RouteObject[] => {
  const routes = Object.values(graph).reduce<RouteObject[]>(
    (accum, graphValue) => {
      const route: RouteObject = {
        path: graphValue.routeAbs,
        lazy: async () => {
          // biome-ignore lint/suspicious/noExplicitAny: Any is actually a module.
          let module: any;
          switch (graphValue.fileExtension) {
            case ".md":
              module = await import(`./docs/${graphValue.filename}.md`);
              break;

            case ".mdx":
              module = await import(`./docs/${graphValue.filename}.mdx`);
              break;

            default:
              throw `No case handling exists for a file with an extension of "${graphValue.fileExtension}"`;
          }
          const Component = module.default;
          return { Component };
        },
      };
      if (Object.values(graphValue.pages).length > 0) {
        return accum.concat(route).concat(createRoute(graphValue.pages));
      }
      return accum.concat(route);
    },
    []
  );
  return routes;
};

const [indexRoute, ...restRoutes] = createRoute(graph);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    loader: ({ request: { url } }) => {
      return {
        graph,
        url,
        header: header ?? null,
      };
    },
    children: [
      {
        lazy: indexRoute.lazy,
        index: true,
      },
      {
        element: <DocsRoute />,

        children: restRoutes,
      },
    ],
  },
]);
