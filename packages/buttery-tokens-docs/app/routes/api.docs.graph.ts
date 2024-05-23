import type { ButteryDocsGraph } from "@buttery/docs/types";
import { json } from "@remix-run/cloudflare";

const graph: ButteryDocsGraph = {
  "getting-started": {
    title: "Getting Started",
    content: "stuff",
    pages: {
      introduction: {
        title: "Introduction",
        content: "",
        pages: {}
      }
    }
  }
};

/**
 * A loader that can either be imported as an alias and then re-exported
 * or straight up re-exported to be used in any route that only requires
 * the documentation graph
 */
export async function loader() {
  return json({ graph });
}

/**
 * A standalone function that fetches the graph from the loader that is defined
 * in this resource route.
 */
export async function getGraph(request: Request) {
  try {
    const requestURL = new URL(request.url);
    const res = await fetch(requestURL.origin.concat("/api/docs/graph"));
    const data = (await res.json()) as ButteryDocsGraph;
    return data;
  } catch (error) {
    throw new Response(
      `There was an error when trying to fetch the documentation graph: ${error}`,
      { status: 500 }
    );
  }
}
