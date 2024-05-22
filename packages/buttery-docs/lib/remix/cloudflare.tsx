import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import type { ButteryDocsGraph } from "../types/index";

export function createRoute(graph: ButteryDocsGraph) {
  async function loader(args: LoaderFunctionArgs) {
    console.log(args.params["*"]);

    return json({ content: graph });
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
    return <pre>{JSON.stringify(loaderData.content, null, 2)}</pre>;
  };

  return {
    loader,
    meta,
    page
  };
}
