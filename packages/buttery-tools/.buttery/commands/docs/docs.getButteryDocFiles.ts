import { type Dirent, readdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { LOG_DOCS } from "./docs.logger";
import type { FileObj } from "./docs.types";

function getRoutePath(filename: string, options?: { staticBaseName?: string }) {
  let basePath = "/";
  if (filename === "_index" && options?.staticBaseName) {
    return basePath.concat(options.staticBaseName);
  }
  const filenameSegments = filename.split(".");
  if (options?.staticBaseName) {
    basePath = basePath.concat(`${options.staticBaseName}/`);
  }
  return basePath.concat(filenameSegments.join("/"));
}

function readDirContents(
  dirents: Dirent[],
  options: { routePrefix: string; staticBaseName?: string }
) {
  return dirents.reduce<FileObj[]>((accum, dirent) => {
    const isFile = dirent.isFile();
    if (!isFile) return accum;
    const fsPath = dirent.parentPath.concat("/").concat(dirent.name);
    const baseFilename = path.parse(dirent.name).name;

    if (baseFilename === ".DS_Store") {
      // ignore Mac specific meta files
      return accum;
    }

    const routePath = getRoutePath(baseFilename, options);
    const filename =
      `${options?.staticBaseName ? `${options?.staticBaseName}.` : ""}`.concat(
        baseFilename
      );

    const routeFileName =
      filename === "_index"
        ? filename
        : filename
            .split(".")
            .reduce<string>((accum, segment, index, origArr) => {
              if (index === 0) {
                return options.routePrefix.concat(segment);
              }
              if (index <= origArr.length - 1 && !origArr.includes("_index")) {
                return accum.concat("_.".concat(segment));
              }
              return accum.concat(".".concat(segment));
            }, "");

    return accum.concat({
      fsPath,
      filename,
      routeFileName,
      routePath
    });
  }, []);
}

/**
 * Fetches the files inside of the buttery docs directory
 * and enriches their entires with some more paths to be used
 * at a later point in graph and order creation.
 */
export async function getButteryDocsFiles(
  config: ButteryDocsConfig
): Promise<FileObj[]> {
  const docsDirectories = await getButteryDocsDirectories(config);

  // get the files inside of the docs directory
  // and enrich them with some of the data
  const docsDirContents = await readdir(docsDirectories.userDocs.root, {
    recursive: false,
    withFileTypes: true
  });

  LOG_DOCS.info(`Detected routeStrategy: ${config.docs.routeStrategy}`);

  const routeStrategy = config.docs.routeStrategy ?? "section-folders";
  const routePrefix = docsDirectories.lib.apps.generated.app.routePrefix;
  switch (routeStrategy) {
    case "flat":
      return readDirContents(docsDirContents, { routePrefix });

    case "section-folders": {
      const files = docsDirContents.reduce<ReturnType<typeof readDirContents>>(
        (accum, dirent) => {
          if (
            dirent.isFile() &&
            (dirent.name === "_index.md" || dirent.name === "_index.mdx")
          ) {
            return accum.concat(readDirContents([dirent], { routePrefix }));
          }

          if (dirent.isDirectory() && dirent.name !== "public") {
            const sectionDir = path.resolve(dirent.parentPath, dirent.name);
            const sectionDirContents = readdirSync(sectionDir, {
              recursive: true,
              withFileTypes: true
            });
            return accum.concat(
              readDirContents(sectionDirContents, {
                routePrefix,
                staticBaseName:
                  dirent.name !== "_index" ? dirent.name : undefined
              })
            );
          }
          return accum;
        },
        []
      );
      return files;
    }

    default:
      return exhaustiveMatchGuard(routeStrategy);
  }
}
