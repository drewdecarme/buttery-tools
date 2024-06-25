import { writeFile } from "node:fs/promises";
import path from "node:path";
import { getButteryDocsFiles } from "../docs/shared.getButteryDocFiles";
import type { ButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/shared.getButteryDocsDirectories";
import { getButteryDocsGraph } from "../docs/shared.getButteryDocsGraph";
import { orderButteryDocFiles } from "../docs/shared.orderButteryDocFiles";

/**
 * Writes the necessary data from the configs that create
 * the docs graph to the files that are consumed by the
 * dev server
 */
export const writeButteryDocsGraphDevData = async (
  config: ButteryDocsConfig
) => {
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);
  const butteryDirs = await getButteryDocsDirectories(config);

  await writeFile(
    path.resolve(butteryDirs.dev.rootDir, "./data.js"),
    `export const graph = ${JSON.stringify(graph, null, 2)};
export const header = ${JSON.stringify(config.docs.header)}\n`
  );
};
