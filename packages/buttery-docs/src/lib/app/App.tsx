import { Meta } from "@buttery/meta/react";
import { Suspense, lazy, useMemo } from "react";
import {
  Link,
  Outlet,
  Route,
  type RouteObject,
  Routes,
  useLocation,
} from "react-router";
import "@buttery/tokens/docs/css";
import type {
  ButteryConfigDocsHeader,
  ButteryDocsRouteManifestEntryDoc,
  ButteryDocsRouteManifestGraphObject,
} from "@buttery/core/config";

import {
  Layout,
  LayoutBody,
  LayoutBodyBreadcrumb,
  LayoutBodyBreadcrumbText,
  LayoutBodyMain,
  LayoutBodyNav,
  LayoutBodyTOC,
  LayoutHeader,
} from "./components";
import { ButteryDocsRouteManifestGraphUtils } from "./utils/RouteGraph";

function createRoute(
  route: ButteryDocsRouteManifestEntryDoc,
  options: { isDocs: boolean }
) {
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

function DocsLayout({
  routeModuleGraph,
}: {
  routeModuleGraph: ButteryDocsRouteManifestGraphUtils;
}) {
  const { pathname } = useLocation();

  const graph = useMemo(() => {
    const pageRoute = pathname.split("/").filter(Boolean)[0];
    const graph = routeModuleGraph.getRouteGraphNodeByRoutePath(pageRoute);
    return graph;
  }, [pathname, routeModuleGraph.getRouteGraphNodeByRoutePath]);

  const breadcrumbLinks = routeModuleGraph.constructBreadcrumbs(pathname);

  return (
    <LayoutBody>
      <LayoutBodyNav graph={graph} />
      <LayoutBodyBreadcrumb>
        <ul>
          {breadcrumbLinks.map((link, i, origArr) => {
            if (i !== origArr.length - 1) {
              return (
                <li key={link.href}>
                  <Link to={link.href}>
                    <LayoutBodyBreadcrumbText>
                      {link.display}
                    </LayoutBodyBreadcrumbText>
                  </Link>
                </li>
              );
            }
            return (
              <li key={link.href}>
                <LayoutBodyBreadcrumbText dxIsActive>
                  {link.display}
                </LayoutBodyBreadcrumbText>
              </li>
            );
          })}
        </ul>
      </LayoutBodyBreadcrumb>
      <Outlet />
    </LayoutBody>
  );
}

/**
 * @deprecated Upgrading to react-router v7. Use the `createButteryDocsRoutes` instead
 */
export function App(props: {
  routeModuleGraph: ButteryDocsRouteManifestGraphUtils;
  header: ButteryConfigDocsHeader | undefined;
  routeDocs: ButteryDocsRouteManifestEntryDoc[];
  routeIndex: ButteryDocsRouteManifestEntryDoc;
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <LayoutHeader header={props.header} />
            <Outlet />
          </Layout>
        }
      >
        <Route
          index
          element={createRoute(props.routeIndex, { isDocs: false }).element}
        />
        <Route
          element={<DocsLayout routeModuleGraph={props.routeModuleGraph} />}
        >
          {props.routeDocs.map((route) => {
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

export function createButteryDocsRoutes(props: {
  routeGraph: ButteryDocsRouteManifestGraphObject;
  header: ButteryConfigDocsHeader | undefined;
  routeDocs: ButteryDocsRouteManifestEntryDoc[];
  routeIndex: ButteryDocsRouteManifestEntryDoc;
}): RouteObject[] {
  const routeModuleGraph = new ButteryDocsRouteManifestGraphUtils(
    props.routeGraph
  );

  return [
    {
      path: "/",
      element: (
        <Layout>
          <LayoutHeader header={props.header} />
          <Outlet />
        </Layout>
      ),
      children: [
        {
          path: "/",
          index: true,
          element: createRoute(props.routeIndex, { isDocs: false }).element,
        },
        {
          element: <DocsLayout routeModuleGraph={routeModuleGraph} />,
          children: props.routeDocs.map((route) =>
            createRoute(route, { isDocs: true })
          ),
        },
      ],
    },
  ];
}
