import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import type { ButteryDocsGraph } from "../types/index";

export function createRoute(graph: ButteryDocsGraph) {
  async function loader(args: LoaderFunctionArgs) {
    console.log(args.params["*"]);

    return json({ content: JSON.stringify(graph, null, 2) });
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
    return <div>{loaderData.content}</div>;
  };

  return {
    loader,
    meta,
    page
  };
}
