import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./util.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./util.getButteryDocsGraph";

/**
 * Writes the necessary data from the configs that create
 * the docs graph to the files that are consumed by the
 * dev server
 */
export const writeButteryDocsGraphDevData = async (
  butteryConfigs: ButteryDocsConfig
) => {
  const graph = await getButteryDocsGraph(butteryConfigs);
  const butteryDirs = getButteryDocsDirectories(butteryConfigs);

  await writeFile(
    path.resolve(butteryDirs.dev.rootDir, "./data.js"),
    `export const graph = ${JSON.stringify(graph, null, 2)};
export const header = ${JSON.stringify(butteryConfigs.docs.header)}\n`
  );
};
