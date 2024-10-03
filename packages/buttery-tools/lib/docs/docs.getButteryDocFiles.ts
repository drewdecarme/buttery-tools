import { type Dirent, readdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { LOG_CLI } from "../logger/loggers";
import { exhaustiveMatchGuard } from "../utils/ts/util.ts.exhaustive-match-guard";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import {
  type ButteryDocsDirectories,
  getButteryDocsDirectories
} from "./docs.getButteryDocsDirectories";
import type { ButteryDocsRoute } from "./docs.types";

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
  options: {
    routePrefix: string;
    staticBaseName?: string;
    dirs: ButteryDocsDirectories;
  }
) {
  return dirents.reduce<ButteryDocsRoute[]>((accum, dirent) => {
    const isFile = dirent.isFile();
    if (!isFile) return accum;
    const fsPath = dirent.parentPath.concat("/").concat(dirent.name);
    const fsPathRelToDocs = fsPath.split("docs/")[1];

    console.log({ fsPath, fsPathRelToDocs });

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
      fsPathRelToDocs,
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
): Promise<ButteryDocsRoute[]> {
  // resolve some directories from the config
  const dirs = await getButteryDocsDirectories(config);

  // Recursively read all of the files in `./.buttery/docs` directory
  const docDirents = await readdir(dirs.srcDocs.root, {
    recursive: false,
    withFileTypes: true
  });

  // filename is the routeManifest ID
  // need isIndex: boolean
  // need routePath: "/"
  // need aliasPath: "@docs/_index.mdx"

  // create the componentManifest

  // then createRoute based upon the component manifest
  // virtual modules needed

  // - virtual:routes-manifest
  // - virtual:root-data (for the header)

  LOG_CLI.info(`Detected routeStrategy: ${config.docs.routeStrategy}`);

  const routeStrategy = config.docs.routeStrategy ?? "section-folders";

  switch (routeStrategy) {
    case "flat":
      return readDirContents(docDirents, { routePrefix, dirs });

    case "section-folders": {
      const files = docDirents.reduce<ReturnType<typeof readDirContents>>(
        (accum, dirent) => {
          const isIndexFile = dirent.isFile() && dirent.name.includes("_index");

          if (isIndexFile) {
            return accum.concat(
              readDirContents([dirent], { routePrefix, dirs })
            );
          }

          const denylist =
            dirent.name.startsWith("_") || dirent.name === "dist";
          const isPageDir = dirent.isDirectory() && !denylist;

          LOG_CLI.debug(`Reading "${dirent.name}"...`);
          if (isPageDir) {
            const sectionDir = path.resolve(dirent.parentPath, dirent.name);
            const sectionDirContents = readdirSync(sectionDir, {
              recursive: true,
              withFileTypes: true
            });

            return accum.concat(
              readDirContents(sectionDirContents, {
                routePrefix,
                dirs,
                staticBaseName:
                  dirent.name !== "_index" ? dirent.name : undefined
              })
            );
          }
          return accum;
        },
        []
      );
      console.log(files);
      return files;
    }

    default:
      return exhaustiveMatchGuard(routeStrategy);
  }
}
