import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "@buttery/tokens/playground/css";
import type { LinksFunction } from "@remix-run/node";

import { LayoutHeader } from "./components/LayoutHeader";
import { LayoutHeaderLogo } from "./components/LayoutHeaderLogo";
import { LayoutHeaderNav } from "./components/LayoutHeaderNav";
import { LayoutMain } from "./components/LayoutMain";
import { Layout as Body } from "./components/Layout";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <Body>
        <LayoutHeader>
          <LayoutHeaderLogo
            dxSrc="/images/buttery-logo-tokens.png"
            dxAlt="buttery-tokens-logo"
          >
            Buttery Tokens
          </LayoutHeaderLogo>
          <LayoutHeaderNav>
            <ul>
              <li>
                <NavLink to="/config">configuration</NavLink>
              </li>
              <li>
                <NavLink to="/projects">projects</NavLink>
              </li>
            </ul>
          </LayoutHeaderNav>
        </LayoutHeader>
        <LayoutMain>{children}</LayoutMain>
        <footer></footer>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
