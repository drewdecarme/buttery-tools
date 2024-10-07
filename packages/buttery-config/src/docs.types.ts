export type ButteryDocsRouteManifestEntry = {
  routePath: string;
  fileName: string;
  fileNameFormatted: string;
  aliasPath: string;
  root: boolean;
};
export type ButteryDocsRouteManifest = {
  [routeId: string]: ButteryDocsRouteManifestEntry;
};
export type ButteryDocsRouteManifestGraphObject = {
  [key: string]: ButteryDocsRouteManifestEntry & {
    pages: ButteryDocsRouteManifestGraphObject;
  };
};
