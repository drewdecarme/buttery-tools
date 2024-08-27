import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
  useRouteLoaderData
} from "@remix-run/react";
import { Layout as LayoutComponent } from "../../../components/layout/Layout";

import "@buttery/tokens/docs/index.css";

import { LayoutHeader } from "../../../components/layout/LayoutHeader";
import { header } from "./data";

export async function loader() {
  return json({
    header: header ?? null
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  // const loaderData = useRouteLoaderData<typeof loader>("root");

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
      <body>
        {/* <LayoutHeader header={loaderData?.header ?? {}} /> */}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
