import get from "lodash.get";
import type { ButteryDocsGraph } from "../types";

export function getPageContentFromRouteParams(
  graph: ButteryDocsGraph,
  routeParams: string | undefined
) {
  if (!routeParams) {
    return graph.index;
  }

  const routeUrl = new URL(`http://whoopidddydoo.com/${routeParams}`);
  const graphPath = routeUrl.pathname
    .split("/")
    .filter((segment) => segment !== "")
    .join(".pages.");

  return get(graph, graphPath);

  //   let currentGraph: ButteryDocsGraphValue | undefined = undefined;

  //   function findContent(segment: string) {
  //     if (!currentGraph[segment]) return;

  //     currentGraph = Object.entries(currentGraph).reduce<
  //       ButteryDocsGraph | undefined
  //     >((accum, [graphKey, graphValue]) => {
  //       if (graphKey === segment) return graphValue.pages;
  //       return accum;
  //     }, undefined);
  //   }

  //   for (const i in segments) {
  //     const segmentIndex = Number(i);
  //     const segment = segments[segmentIndex];

  //     findContent(segment);
  //   }

  //   return undefined;
}
