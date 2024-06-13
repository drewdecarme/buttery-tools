import { type RouteObject, createBrowserRouter } from "react-router-dom";
import type { ButteryDocsGraph } from "../../commands/_utils/types";
import { graph, header } from "./data";
import RootRoute from "./routes/root";

const createRoute = (graph: ButteryDocsGraph): RouteObject[] => {
  const routes = Object.values(graph).reduce<RouteObject[]>(
    (accum, graphValue) => {
      const route = {
        path: graphValue.routeAbs,
        lazy: async () => {
          const module = await import(`./docs/${graphValue.filename}.md`);
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

const routes = createRoute(graph);
console.log(routes);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    loader: () => ({
      graph,
      header: header ?? null,
    }),
    children: routes,
  },
]);
