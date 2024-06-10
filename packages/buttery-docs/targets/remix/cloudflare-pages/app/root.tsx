import { makeFontFamily } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import { getButteryDocsConfig } from "../../../../commands/_utils/util.getButteryDocsConfig";
import { getButteryDocsGraph } from "../../../../commands/_utils/util.getButteryDocsGraph";

export async function loader(args: LoaderFunctionArgs) {
  console.log(args);
  const butteryDocsConfig = await getButteryDocsConfig();
  const butteryDocsGraph = await getButteryDocsGraph(butteryDocsConfig);
  console.log(JSON.stringify(butteryDocsGraph, null, 2));
  return json({ graph: butteryDocsGraph });
}

const SBody = styled("body")`
  font-family: ${makeFontFamily("body")};
`;

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  console.log({ data });

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
        <h1>Layout</h1>
        <div style={{ border: "1px solid red" }}>
          <h2>Content</h2>
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </SBody>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
