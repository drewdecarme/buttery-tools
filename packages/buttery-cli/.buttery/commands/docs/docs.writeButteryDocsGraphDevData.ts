import { writeFile } from "node:fs/promises";
import path from "node:path";
import { getButteryDocsFiles } from "./docs.getButteryDocFiles";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./docs.getButteryDocsGraph";
import { orderButteryDocFiles } from "./docs.orderButteryDocFiles";

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
    path.resolve(
      butteryDirs.artifacts.docs.apps.dev.dynamicApp.root,
      "./data.js"
    ),
    `export const graph = ${JSON.stringify(graph, null, 2)};
export const header = ${JSON.stringify(config.docs.header)}\n`
  );
};
