import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Sidebar } from "../../components";
import type { ButteryDocsGraph } from "../../types/index";

export function createRoute(graph: ButteryDocsGraph) {
  async function loader(args: LoaderFunctionArgs) {
    console.log({ segments: args.params["*"] });

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
    return (
      <>
        <Sidebar graph={loaderData.content} />
      </>
    );
  };

  return {
    loader,
    meta,
    page
  };
}
