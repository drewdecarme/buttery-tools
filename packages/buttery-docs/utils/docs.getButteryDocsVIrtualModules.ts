import type {
  ButteryDocsRouteManifest,
  ButteryDocsRouteManifestEntry,
} from "@buttery/config";
import { produce } from "immer";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsRouteGraph } from "./docs.getButteryDocsRouteGraph";
import { LOG } from "./docs.utils";

export function getButteryDocsVirtualModules(
  config: ButteryDocsConfig,
  routeManifest: ButteryDocsRouteManifest
) {
  const routeGraph = getButteryDocsRouteGraph(routeManifest);
  const { routeIndex, routeDocs } = Object.entries(routeManifest).reduce<{
    routeIndex: ButteryDocsRouteManifestEntry | undefined;
    routeDocs: ButteryDocsRouteManifest;
  }>(
    (accum, [routeId, routeManifestEntry]) => {
      if (routeManifestEntry.root) {
        return produce(accum, (draft) => {
          draft.routeIndex = routeManifestEntry;
        });
      }
      return produce(accum, (draft) => {
        draft.routeDocs[routeId] = routeManifestEntry;
      });
    },
    { routeIndex: undefined, routeDocs: {} }
  );

  // Validate that the
  LOG.debug("Validating index file exists...");
  if (typeof routeIndex === "undefined") {
    throw LOG.fatal(
      new Error(
        "Cannot find an '_index' route. Ensure that you have added an _index.(md|mdx) route inside of the '.buttery/docs' directory."
      )
    );
  }
  LOG.debug("Validating index file exists... done.");

  const routes = `import { ButteryDocsRouteManifestGraphUtils } from "@buttery/tools/docs";
export const routeIndex = {
  routePath: "/",
  aliasPath: "${routeIndex.aliasPath}",
  root: "${routeIndex.root}",
  importComponent: async () => await import("@docs${routeIndex.aliasPath}")
};
export const routeDocs = [${Object.values(routeDocs).map(
    (routeEntry) => `\{
  routePath: "${routeEntry.routePath}",
  aliasPath: "${routeEntry.aliasPath}",
  root: "${routeEntry.root}",
  importComponent: async () => await import("@docs${routeEntry.aliasPath}")
\}`
  )}];
export const RouteGraph = new ButteryDocsRouteManifestGraphUtils(${JSON.stringify(
    routeGraph,
    null,
    2
  )});
  `;

  const data = `export const header = ${JSON.stringify(config.docs.header)}`;

  return {
    routes,
    data,
  };
}
