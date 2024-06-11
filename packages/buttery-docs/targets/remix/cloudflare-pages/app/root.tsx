import { makeFontFamily, makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "@buttery/tokens/_docs/index.css";
// import "highlight.js/styles/base16/onedark.min.css";
// import "highlight.js/styles/base16/material.min.css";

const SBody = styled("body")`
  font-family: ${makeFontFamily("body")};

  pre {
    padding: ${makeRem(20)};
    overflow-x: auto;
    border-radius: ${makeRem(8)};
    font-size: ${makeRem(12)};

    .line {
      line-height: 1.5;
    }
  }
`;

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
      <SBody>
        {children}
        <ScrollRestoration />
        <Scripts />
      </SBody>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
