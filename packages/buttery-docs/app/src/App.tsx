import { header } from "virtual:data";
import { routeDocs, routeIndex } from "virtual:routes";
import { Meta } from "@buttery/meta/react";
import { Suspense, lazy, useMemo } from "react";
import {
  Outlet,
  Route,
  type RouteObject,
  Routes,
  useLocation,
} from "react-router-dom";
import "@buttery/tokens/docs.css";
import "@buttery/docs-ui/css";

import {
  Layout,
  LayoutBody,
  LayoutBodyMain,
  LayoutBodyNav,
  LayoutBodyTOC,
  LayoutHeader,
} from "@buttery/docs-ui";
import { routeModuleGraph } from "../utils/RouteGraph";

function createRoute(route: typeof routeIndex, options: { isDocs: boolean }) {
  const Component = lazy(async () => {
    // Import the .(md|mdx) file as a component and collect
    // the other information that was supplied to it
    const {
      default: DocumentComponent,
      tableOfContents,
      frontmatter,
    } = await route.importComponent();

    if (!options.isDocs) {
      return {
        default: () => (
          <>
            <Meta metaJSON={frontmatter} />
            <DocumentComponent />
          </>
        ),
      };
    }
    return {
      default: () => {
        return (
          <>
            <Meta metaJSON={frontmatter} />
            <LayoutBodyMain>
              <DocumentComponent />
            </LayoutBodyMain>
            <LayoutBodyTOC tableOfContents={tableOfContents} />
          </>
        );
      },
    };
  });

  return {
    index: true,
    path: route.routePath,
    element: (
      <Suspense
        // We want to wait to render anything until the component is ready
        fallback={null}
      >
        <Component />
      </Suspense>
    ),
  };
}

function AppLayout() {
  return (
    <Layout>
      <LayoutHeader header={header} />
      <Outlet />
    </Layout>
  );
}

function DocsLayout() {
  const { pathname } = useLocation();
  const graph = useMemo(() => {
    const pageRoute = pathname.split("/").filter(Boolean)[0];
    const graph = routeModuleGraph.getRouteGraphNodeByRoutePath(pageRoute);
    return graph;
  }, [pathname]);

  return (
    <LayoutBody>
      <LayoutBodyNav graph={graph} />
      <Outlet />
    </LayoutBody>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={createRoute(routeIndex, { isDocs: false }).element}
        />
        <Route element={<DocsLayout />}>
          {routeDocs.map((route) => {
            return (
              <Route
                key={route.routePath}
                {...createRoute(route, { isDocs: true })}
                index
              />
            );
          })}
        </Route>
      </Route>
    </Routes>
  );
}
