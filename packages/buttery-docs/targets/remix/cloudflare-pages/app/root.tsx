import { makeFontFamily } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import { getButteryDocsConfig } from "../../../../commands/_utils/util.getButteryDocsConfig";
import { getButteryDocsGraph } from "../../../../commands/_utils/util.getButteryDocsGraph";

import { Layout as RootLayout } from "../../../components/Layout";
import "@buttery/tokens/_docs/index.css";
import { type FC, useMemo } from "react";

export async function loader(args: LoaderFunctionArgs) {
  const butteryDocsConfig = await getButteryDocsConfig();
  const butteryDocsGraph = await getButteryDocsGraph(butteryDocsConfig);
  return json({
    graph: butteryDocsGraph,
    header: butteryDocsConfig.docs.header ?? null,
  });
}

const SBody = styled("body")`
  font-family: ${makeFontFamily("body")};
`;

const RemixNavLink: FC<JSX.IntrinsicElements["a"] & { href: string }> = ({
  children,
  href,
  ...restProps
}) => (
  <NavLink to={href} {...restProps} end>
    {children}
  </NavLink>
);

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

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
        <RootLayout {...useMemo(() => data, [data])} NavLink={RemixNavLink}>
          {children}
        </RootLayout>
        <ScrollRestoration />
        <Scripts />
      </SBody>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
