import { LOG_CLI } from "../logger/loggers";
import type {
  ButteryDocsRouteManifest,
  ButteryDocsRouteManifestEntry,
  ButteryDocsRouteManifestGraphObject
} from "./docs.types";

/**
 * Takes the route manifest and recursively turns it into a graphical
 * representation of the routes. For instance if the route path is
 * /commands/getting-started/reference, this function will split the path
 * and create a nested graph of those segments such as `commands.pages.getting-started.pages.reference`.
 *
 * This function is created to automatically adapt to any additions to the route manifest. There is
 * no code in this function that will add any properties or delete any. Instead it's only
 * purpose is to read the route segments and create a nested graph of them. This
 * is done intentionally so that the route manifest is the central brain to a lot of the data
 * that is needed to make routing and the things around them as clean as possible as well
 * as provide the ability to scale the manifest as needed.
 */
export type ButteryDocsRouteManifestGraph = ReturnType<
  typeof getButteryDocsRouteGraph
>;
export function getButteryDocsRouteGraph(
  routeManifest: ButteryDocsRouteManifest
) {
  const graphObj: ButteryDocsRouteManifestGraphObject = {};

  function addRouteGraphNode(manifestEntry: ButteryDocsRouteManifestEntry) {
    const manifestEntrySegments = manifestEntry.routePath
      .split("/")
      .filter(Boolean);
    console.log({ manifestEntrySegments });

    let currentGraphObj = graphObj;

    for (const segment of manifestEntrySegments) {
      if (!currentGraphObj[segment]) {
        LOG_CLI.debug(
          `Segment "${segment}" doesn't exist. Creating nested graph.`
        );
        currentGraphObj[segment] = {
          ...manifestEntry,
          pages: {}
        };
      } else {
        currentGraphObj = currentGraphObj[segment].pages;
      }
    }
  }

  // Get all of the values (GraphEntires) of the manifest
  // and loop through them figure out where they should go
  const manifestEntries = Object.values(routeManifest);
  for (const manifestEntry of manifestEntries) {
    LOG_CLI.debug(`Adding "${manifestEntry.routePath}" to the route graph...`);
    addRouteGraphNode(manifestEntry);
    LOG_CLI.debug(
      `Adding "${manifestEntry.routePath}" to the route graph... done.`
    );
  }

  function getFullRouteGraph() {
    return graphObj;
  }

  function getRouteGraphNodeByRoutePath(
    routePath: string
  ): ButteryDocsRouteManifestGraphObject {
    const segments = routePath.split("/").filter(Boolean);
    const routeGraphNode = segments.reduce<ButteryDocsRouteManifestGraphObject>(
      (accum, segment, i) => {
        LOG_CLI.debug(`Searching for segment: ${segment}`);
        if (accum[segment] && i < segments.length - 1) {
          return accum[segment].pages;
        }
        if (accum[segment]) {
          return { [segment]: accum[segment] };
        }
        return accum;
      },
      graphObj
    );

    if (Object.values(routeGraphNode).length === 0) {
      throw LOG_CLI.fatal(
        new Error(
          `Cannot locate a ButteryDocsRouteManifestGraph node for the path: ${routePath}`
        )
      );
    }

    return routeGraphNode;
  }

  return {
    getFullRouteGraph,
    getRouteGraphNodeByRoutePath
  };
}
