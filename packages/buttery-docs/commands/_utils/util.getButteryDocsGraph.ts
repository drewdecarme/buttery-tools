import { readdir } from "node:fs/promises";
import path from "node:path";
import { createGraph } from "./util.createGraph";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./util.getButteryDocsDirectories";
import { getRoutePath } from "./util.getRoutePath";
import { orderFiles } from "./util.orderFiles";

/**
 * Creates a graph/object representation of the the files
 * contained inside of the docs directory that is referenced
 * in the `buttery.config.ts` file. This graph is a recursive representation
 * of the files and can then be recursed through to build routes, navigational
 * items, etc... Think of it like an AST but only for the docs that are defined
 * in the folder that the user specified in their `buttery.config.ts`.
 */
export async function getButteryDocsGraph(config: ButteryDocsConfig) {
  const docsDirectories = getButteryDocsDirectories(config);

  // get the files inside of the docs directory
  // and enrich them with some of the data
  const docsDirContents = await readdir(docsDirectories.docs, {
    recursive: false,
    withFileTypes: true,
  });
  const docsDirFiles = docsDirContents.reduce<
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

  // order the files
  const files = orderFiles({
    docsConfig: config.docs,
    files: docsDirFiles,
  });

  // create the graph
  const docsGraph = await createGraph({
    docsConfig: config.docs,
    files,
  });
  return docsGraph;
}
