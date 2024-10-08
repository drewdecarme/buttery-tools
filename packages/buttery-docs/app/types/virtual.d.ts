declare module "virtual:routes" {
  import type { ButteryDocsRouteManifestGraphObject } from "@buttery/config/docs";
  // Adjust the types based on what your `virtual:routes` module exports
  export const routeGraph: ButteryDocsRouteManifestGraphObject;
  export const routeDocs: ButteryDocsRouteManifestEntry & {
    importComponent: () => Promise<{
      default: JSX.ElementType;
      tableOfContents: TableOfContents;
      frontmatter: Record<string, unknown>;
    }>;
  };
  export const routeIndex: (typeof routeDocs)[0];
}

declare module "virtual:data" {
  import type {
    ButteryConfigDocs,
    ButteryDocsRouteManifest,
  } from "@buttery/config";
  export const header: ButteryConfigDocs["header"];
}
