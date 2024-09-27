import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "@buttery/tokens/docs/css";
import {
  LayoutHeader,
  Layout as LayoutRoot,
  RootLinks,
} from "~/buttery/docs/components";
import { header } from "~/buttery/docs/data";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <RootLinks />
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
