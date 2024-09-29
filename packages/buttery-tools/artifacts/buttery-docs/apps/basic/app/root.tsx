import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "@buttery/tokens/docs/css";
import "@buttery/tools/docs/css";
import {
  LayoutHeader,
  Layout as LayoutRoot,
  RootLinks,
} from "@buttery/tools/docs";
import { header } from "./data";

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
