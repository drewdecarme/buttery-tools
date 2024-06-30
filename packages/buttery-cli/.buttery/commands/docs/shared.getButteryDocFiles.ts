import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ButteryDocsConfig } from "./shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./shared.getButteryDocsDirectories";

function getRoutePath(filename: string) {
  // TODO: Needs more scenarios and testing
  if (filename === "_index") {
    return "/";
  }
  return "/".concat(filename.split(".").join("/"));
}

/**
 * Fetches the files inside of the buttery docs directory
 * and enriches their entires with some more paths to be used
 * at a later point in graph and order creation.
 */
export async function getButteryDocsFiles(config: ButteryDocsConfig) {
  const docsDirectories = await getButteryDocsDirectories(config);

  // get the files inside of the docs directory
  // and enrich them with some of the data
  const docsDirContents = await readdir(docsDirectories.userDocs.root, {
    recursive: false,
    withFileTypes: true,
  });

  const enrichedButteryDocsFiles = docsDirContents.reduce<
    {
      fsPath: string;
      filename: string;
      routePath: string;
    }[]
  >((accum, dirent) => {
    const isFile = dirent.isFile();
    if (!isFile) return accum;
    const fsPath = dirent.parentPath.concat("/").concat(dirent.name);
    const filename = path.parse(dirent.name).name;
    const routePath = getRoutePath(filename);

    return accum.concat({
      fsPath,
      filename,
      routePath,
    });
  }, []);
  return enrichedButteryDocsFiles;
}
