import { Suspense } from "react";
import React from "react";
import { type RouteObject, createBrowserRouter } from "react-router-dom";
import type { ButteryDocsGraph } from "../../commands/_utils/types";
import { graph, header } from "./data";
import RootRoute from "./routes/root";

// import Index from "../0ca9af1273702fdea8433ff56ce114eac4dc9b061ef11ba0c1df178537dfc227/docs/_index.md";

// function createModImports = (graph: ButteryDocsGraph) => {

// }

const mdxModules = Object.values(graph as ButteryDocsGraph).reduce(
  (accum, graphValue) => {
    return Object.assign(accum, {
      [graphValue.filename]: React.lazy(
        () => import(`./docs/${graphValue.filename}.md`)
      ),
    });
  },
  {}
);

const createRoute = (graph: ButteryDocsGraph): RouteObject[] | undefined => {
  if (Object.entries(graph).length === 0) return undefined;
  // @ts-ignore
  const routes = Object.values(graph).map<RouteObject>((graphValue) => {
    const Component = mdxModules[graphValue.filename];
    return {
      path: graphValue.routeRel,
      element: Component ? (
        <Suspense>
          <Component />
        </Suspense>
      ) : (
        <div>no component yet</div>
      ),
      children: createRoute(graphValue.pages),
    };
  });
  return routes;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    loader: () => ({
      graph,
      header: header ?? null,
    }),
    children: createRoute(graph),
  },
]);
