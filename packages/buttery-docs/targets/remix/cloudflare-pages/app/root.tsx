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

export async function loader() {
  const config = await getButteryDocsConfig();
  const graph = await getButteryDocsGraph(config);
  console.log({ graph });
  return json({ graph });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  console.log({ data });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Layout</h1>
        <div style={{ border: "1px solid red" }}>
          <h2>Content</h2>
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
