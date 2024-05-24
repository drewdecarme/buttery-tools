// TODO: Turn this into a Layout component
import { Sidebar } from "@buttery/docs/components";
import "@buttery/docs/css";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData
} from "@remix-run/react";

import type { ButteryDocsGraph } from "@buttery/docs/types";
import { getGraph } from "./routes/api.docs.graph";

// Method 1: Re-export the loader
// export const loader = docsLoader;

// Method 2: Use the standalone async function
// this allows you to be able to export anything else
// other than just the loader
export async function loader(args: LoaderFunctionArgs) {
  const { graph } = await getGraph(args.request);
  return json({ graph });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<{ graph: ButteryDocsGraph }>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Sidebar graph={loaderData.graph} />
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
