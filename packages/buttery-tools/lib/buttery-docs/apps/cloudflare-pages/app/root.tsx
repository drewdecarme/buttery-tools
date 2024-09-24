import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "@buttery/tokens/docs/css";

import { header } from "@buttery/docs/data";
import { Layout as LayoutRoot } from "../../../components/layout/Layout";
import { LayoutHeader } from "../../../components/layout/LayoutHeader";
import { RootLinks } from "../../../components/root/RootLinks";

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
