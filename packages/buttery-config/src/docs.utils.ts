import { LOG } from "./buttery-config.utils";
import type { ButteryDocsRouteManifestGraphObject } from "./docs.types";

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
        LOG.debug(`Searching for segment: ${segment}`);
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

    if (Object.values(routeGraphNode).length === 0) {
      throw LOG.fatal(
        new Error(
          `Cannot locate a ButteryDocsRouteManifestGraph node for the path: ${routePath}`
        )
      );
    }

    return routeGraphNode;
  }
}
