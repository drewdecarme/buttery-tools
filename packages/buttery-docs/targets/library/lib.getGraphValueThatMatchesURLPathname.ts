import type {
  ButteryDocsGraph,
  ButteryDocsGraphValue,
} from "../../commands/_utils/types";

/**
 * Provided a url string and a docs graph, this function will
 * parse the pathname off of the URL and then recursively search
 * the graph tree to find a routeAbs path that matches that pathname
 */
export function getGraphValueThatMatchesURLPathname(
  url: string,
  graph: ButteryDocsGraph
) {
  const reqUrl = new URL(url);
  const { pathname } = reqUrl;

  let graphValue: ButteryDocsGraphValue | undefined;

  function findGraphValue(innerGraph: ButteryDocsGraph) {
    for (const innerGraphValue of Object.values(innerGraph)) {
      const { routeAbs, pages } = innerGraphValue;
      if (routeAbs === pathname) {
        graphValue = innerGraphValue;
        // exit the loop early when found
        return;
      }
      // recurse until no more
      findGraphValue(pages);
    }
  }

  findGraphValue(graph);

  if (!graphValue)
    throw new Error(
      `Cannot find Table of Contents for "${pathname}". This should not have happened. Please contact support.`
    );

  return graphValue;
}
