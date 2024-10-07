import type { ButteryDocsRouteManifestGraph } from "@buttery/tools/docs";

declare module "virtual:routes" {
  // Define the types for `RouteGraph` and other exports as needed
  export interface RouteGraph extends ButteryDocsRouteManifestGraph {}

  // Adjust the types based on what your `virtual:routes` module exports
  export const RouteGraph: ButteryDocsRouteManifestGraph;
}
