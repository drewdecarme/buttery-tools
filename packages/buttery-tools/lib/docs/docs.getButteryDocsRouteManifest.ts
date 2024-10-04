import { type Dirent, readdirSync } from "node:fs";
import path from "node:path";
import { printAsBullets } from "@buttery/logger";
import { LOG_CLI } from "lib/logger/loggers";
import type { ButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import type { ButteryDocsRouteManifest } from "./docs.types";

const shouldReadDirectory = (dirent: Dirent): boolean => {
  // TODO: Figure out what level the dirent is in relation to the root directory
  // TODO: V2 - Outside of a few reserved directories, let the user decide which patterns
  // they want excluded
  return !dirent.name.startsWith("_") && dirent.name !== "dist";
};

function getPageSegmentsFromRouteId(routeId: string) {
  const pageNameRegEx = /^\/([^/]+)\//;
  const match = routeId.match(pageNameRegEx);
  const pageName = match?.[1];
  return pageName ? [pageName] : [];
}

function getRouteSegmentsFromRouteId(routeId: string) {
  const routeExtension = path.extname(routeId);
  const routeFilepath = routeId.split(routeExtension)[0];
  const routeSegments = routeFilepath
    .split("/")
    [routeFilepath.split("/").length - 1].split(".");
  LOG_CLI.debug(
    `Getting route segments from route filepath: ${routeFilepath}${printAsBullets(routeSegments)}`
  );
  return routeSegments;
}

function getRoutePathFromRouteId(routeId: string): string {
  const pageSegments = getPageSegmentsFromRouteId(routeId);
  const routeSegments = getRouteSegmentsFromRouteId(routeId);
  const segments = pageSegments
    .concat(routeSegments)
    .filter((segment) => segment !== "_index");
  return `/${segments.join("/")}`;
}

/**
 * Recursively reads the directories and files inside of the .buttery/docs
 * directory and creates a manifest in which files can be referenced and
 * dynamically imported.
 */
export function getButteryDocsRouteManifest(
  dirs: ButteryDocsDirectories
): ButteryDocsRouteManifest {
  const routeManifest: ButteryDocsRouteManifest = {};

  // Recursively read each directory in the docs to
  // create route manifest entries
  function createRoutes(dir: string) {
    // read the directory and return the Dirent object
    const dirents = readdirSync(dir, { withFileTypes: true });

    for (const dirent of dirents) {
      const direntFullPath = path.resolve(dirent.parentPath, dirent.name);

      // Recursively read the nested directories in the .buttery/docs folder.
      // that aren't pre-determined to be ignored.
      // Note that since we're only specifying one level deep so we need
      // to track to make sure that we don't include any folders that
      // the user nested below 1 level in the docs.
      // The rationale for making this recursive is that at some-point in the future
      // there might be a need to expand the routing conventions into something more
      // complex and I felt it better to adapt a recursive function than a simple reduction
      if (dirent.isDirectory() && shouldReadDirectory(dirent)) {
        LOG_CLI.debug(
          `Detected page "${dirent.name}". Reading page directory...`
        );
        createRoutes(direntFullPath);
      }

      // If the dirent is a file, let's go ahead and process it
      // and create a manifest entry
      if (dirent.isFile()) {
        const routeId = direntFullPath.split(dirs.srcDocs.root)[1];
        LOG_CLI.debug(`Creating manifest for route: ${routeId}`);
        const aliasPath = routeId;
        const routePath = getRoutePathFromRouteId(routeId);
        const routeSegments = routePath.split("/");
        const fileName = routeSegments[routeSegments.length - 1];
        const isRoot = routeId.startsWith("/_index");

        routeManifest[routeId] = {
          aliasPath,
          fileName,
          routePath,
          root: isRoot
        };
      }
    }
  }

  createRoutes(dirs.srcDocs.root);

  return routeManifest;
}
