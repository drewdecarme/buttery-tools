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

    let currentGraphObj = graphObj;

    for (const segmentIndex in manifestEntrySegments) {
      const i = Number(segmentIndex);
      const segment = manifestEntrySegments[segmentIndex];
      if (!currentGraphObj[segment]) {
        LOG_CLI.debug(
          `Segment "${segment}" doesn't exist. Creating nested graph.`
        );
        currentGraphObj[segment] = {
          aliasPath: "",
          fileName: "",
          fileNameFormatted: "",
          root: false,
          routePath: "",
          pages: {}
        };
      }

      // this ensures the contents of the segment are put
      // in the correct place and not in the parent. There
      if (i === manifestEntrySegments.length - 1) {
        console.log(currentGraphObj[segment]);
        currentGraphObj[segment] = {
          ...manifestEntry,
          pages: currentGraphObj[segment].pages
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

  return graphObj;
}

/**
 * A collection of utilities to easily transact on the route manifest
 * graph to display and work with recursive data.
 */
export class ButteryDocsRouteManifestGraphUtils {
  private routeManifestGraph: ButteryDocsRouteManifestGraphObject;

  constructor(routeManifestGraph: ButteryDocsRouteManifestGraphObject) {
    this.routeManifestGraph = routeManifestGraph;
  }

  get graph() {
    return this.routeManifestGraph;
  }

  /**
   * Provided a route path (that is a slash delimited route that will)
   * render on the front-end, this function will return the graph node
   * that matches that browser route path
   */
  getRouteGraphNodeByRoutePath(
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
      this.routeManifestGraph
    );

    console.log(routeGraphNode);

    if (Object.values(routeGraphNode).length === 0) {
      throw LOG_CLI.fatal(
        new Error(
          `Cannot locate a ButteryDocsRouteManifestGraph node for the path: ${routePath}`
        )
      );
    }

    return routeGraphNode;
  }
}
