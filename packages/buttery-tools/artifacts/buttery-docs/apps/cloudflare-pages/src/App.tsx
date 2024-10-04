import { routeDocs, routeIndex } from "virtual:routes";
import type { ButteryDocsRouteManifestEntry } from "@buttery/tools/docs";
import { Suspense, lazy } from "react";
import {
  type IndexRouteObject,
  Outlet,
  //   Outlet,
  Route,
  //   type RouteObject,
  Routes,
} from "react-router-dom";
// import { Layout } from "./components/Layout";
// import { graph } from "./components/Layout.stories.data";
// import { LayoutBody } from "./components/LayoutBody";
// import { LayoutBodyMain } from "./components/LayoutBodyMain";
// import { LayoutBodyNav } from "./components/LayoutBodyNav";
// import { LayoutBodyTOC } from "./components/LayoutBodyTOC";
// import { LayoutHeader } from "./components/LayoutHeader";
import { LayoutBody } from "./components/LayoutBody";
import { LayoutBodyMain } from "./components/LayoutBodyMain";
import "@buttery/tokens/docs/css";
import AppLayout from "./App.Layout";

function createRoute(route: ButteryDocsRouteManifestEntry): IndexRouteObject {
  const Component = lazy(async () => {
    // Import the MDX file as a component
    const { default: DocumentComponent, ...restImports } =
      await route.importComponent();

    console.log(restImports);
    // const { default: DocumentComponent } = await route.importComponent();
    // Return it as a default export in an object
    return { default: DocumentComponent };
  });

  console.log(route.routePath);

  return {
    index: true,
    path: route.routePath,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    ),
  };
}

console.log(JSON.stringify(routeDocs, null, 2));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={createRoute(routeIndex).element} />
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
          {routeDocs.map((r) => {
            return <Route key={r.routePath} {...createRoute(r)} />;
          })}
        </Route>
      </Route>
    </Routes>
  );
}
