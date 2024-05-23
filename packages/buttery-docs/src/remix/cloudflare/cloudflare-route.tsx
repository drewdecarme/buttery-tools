import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { Sidebar } from "../../components";
import type { ButteryDocsGraph } from "../../types/index";

export function createRootRoute(graph: ButteryDocsGraph) {
  async function loader(_args: LoaderFunctionArgs) {
    return json({ graph });
  }

  function Layout({ children }: { children: React.ReactNode }) {
    const loaderData = useLoaderData<typeof loader>();

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <header>header</header>
          <main>
            <Sidebar graph={loaderData.graph} />
            {children}
          </main>
          <footer>footer</footer>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  function App() {
    return <Outlet />;
  }

  return {
    loader,
    App,
    Layout
  };
}

export function createRoute(graph: ButteryDocsGraph) {
  async function loader(args: LoaderFunctionArgs) {
    console.log({ segments: args.params["*"] });

    return json({ graph, segments: args.params["*"] });
  }

  const meta: MetaFunction = () => {
    return [
      {
        title: "test"
      }
    ];
  };

  const page = () => {
    const loaderData = useLoaderData<typeof loader>();
    return (
      <pre
        style={{
          background: "#ccc"
        }}
      >
        {JSON.stringify(loaderData, null, 2)}
      </pre>
    );
  };

  return {
    loader,
    meta,
    page
  };
}
