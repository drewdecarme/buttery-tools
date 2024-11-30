import "@buttery/docs/css";
import { header } from "virtual:data";
import { routeDocs, routeGraph, routeIndex } from "virtual:routes";
import { App, ButteryDocsRouteManifestGraphUtils } from "@buttery/docs/app";

export const routeModuleGraph = new ButteryDocsRouteManifestGraphUtils(
  routeGraph
);

export function ButteryDocsApp() {
  return (
    <App
      header={header}
      routeDocs={routeDocs}
      routeIndex={routeIndex}
      routeModuleGraph={routeModuleGraph}
    />
  );
}
