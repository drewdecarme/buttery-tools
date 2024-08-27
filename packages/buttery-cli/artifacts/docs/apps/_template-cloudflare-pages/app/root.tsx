import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import {
  Layout as LayoutComponent,
  bodyCSS
} from "../../../components/layout/Layout";

import "@buttery/tokens/docs/index.css";

import { graph, header } from "./data";

export async function loader() {
  return json({
    graph: graph,
    header: header ?? null
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      {error ? (
        <body>Error</body>
      ) : (
        <body className={bodyCSS}>
          <LayoutComponent
            header={loaderData.header}
            // @ts-expect-error mismatch
            graph={loaderData.graph}
          >
            {children}
          </LayoutComponent>
          <ScrollRestoration />
          <Scripts />
        </body>
      )}
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error?.message ?? "Unknown error"}</p>
    </>
  );
}
