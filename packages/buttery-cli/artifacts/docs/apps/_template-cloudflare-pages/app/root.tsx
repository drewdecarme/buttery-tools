import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import "@buttery/tokens/docs/index.css";

import { Layout as LayoutRoot } from "../../../components/layout/Layout";
import { LayoutHeader } from "../../../components/layout/LayoutHeader";
import { header } from "./data";

export function Layout({ children }: { children: React.ReactNode }) {
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
      <LayoutRoot>
        <LayoutHeader header={header} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </LayoutRoot>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
