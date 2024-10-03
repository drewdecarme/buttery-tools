import type { ButteryDocsRouteManifestEntry } from "@buttery/tools/docs";
import { dataHeader } from "__ROUTE_MANIFEST__";
import { Suspense, lazy } from "react";
import {
  type IndexRouteObject,
  Outlet,
  Route,
  type RouteObject,
  Routes,
} from "react-router-dom";
import { Layout } from "./components/Layout";
// import { graph } from "./components/Layout.stories.data";
import { LayoutBody } from "./components/LayoutBody";
import { LayoutBodyMain } from "./components/LayoutBodyMain";
// import { LayoutBodyNav } from "./components/LayoutBodyNav";
// import { LayoutBodyTOC } from "./components/LayoutBodyTOC";
import { LayoutHeader } from "./components/LayoutHeader";

import { header } from "virtual:data";
import { routeDocs, routeIndex } from "virtual:routes";

console.log(routeDocs);

function createRoute(route: ButteryDocsRouteManifestEntry): IndexRouteObject {
  const Component = lazy(async () => {
    // Import the MDX file as a component
    // const { default: DocumentComponent } = await import(`@docs/_index.mdx`);
    const { default: DocumentComponent } = await route.importComponent();
    // Return it as a default export in an object
    return { default: DocumentComponent };
  });

  return {
    path: route.routePath,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    ),
  };
}

const App = () => (
  <Routes>
    <Route
      element={
        <Layout>
          <LayoutHeader header={header} />
          <Outlet />
        </Layout>
      }
    >
      <Route index {...createRoute(routeIndex)} />
      <Route
        element={
          <LayoutBody>
            {/* <LayoutBodyNav graph={routeGraph} /> */}
            <LayoutBodyMain>
              <Outlet />
            </LayoutBodyMain>
            {/* <LayoutBodyTOC graph={graph} /> */}
          </LayoutBody>
        }
      >
        {routeDocs.map((route, i) => {
          return <Route key={route.routePath} index {...createRoute(route)} />;
        })}
      </Route>
    </Route>
  </Routes>
);

export default App;
