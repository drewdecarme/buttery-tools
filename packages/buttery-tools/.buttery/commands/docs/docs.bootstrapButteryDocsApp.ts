import { writeFile } from "node:fs/promises";
import type { GetButteryConfigOptions } from "../_buttery-config";
import { LOG } from "../_logger";
import { getButteryDocsFiles } from "./docs.getButteryDocFiles";
import { getButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./docs.getButteryDocsGraph";
import { orderButteryDocFiles } from "./docs.orderButteryDocFiles";

/**
 * Bootstraps the entire buttery docs application before either
 * running the development server or building the distribution
 * with Vite.
 */
export async function bootstrapButteryDocsApp(
  options?: GetButteryConfigOptions
) {
  const config = await getButteryDocsConfig(options);
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);
  const dirs = await getButteryDocsDirectories(config);

  try {
    LOG.debug("Writing docs data...");
    const dataContent = `export const graph = ${JSON.stringify(graph, null, 2)};
export const header = ${JSON.stringify(config.docs.header)};
`;
    await writeFile(dirs.artifacts.apps.template.dataFile, dataContent);
    LOG.debug("Writing docs data... done.");
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
