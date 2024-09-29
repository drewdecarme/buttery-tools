import { copyFile, cp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { ensureFile } from "fs-extra";
import { LOG_CLI } from "../../logger";
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
export async function bootstrapButteryDocsApp() {
  LOG_CLI.checkpointStart("bootstrap");
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);

  // copy the template
  try {
    await rm(dirs.artifacts.apps.working.root, {
      recursive: true,
      force: true
    });
    LOG_CLI.debug("Copying the template to the working directory...");
    await cp(
      dirs.artifacts.apps.template.root,
      dirs.artifacts.apps.working.root,
      {
        recursive: true
      }
    );
    LOG_CLI.debug("Copying the template to the working directory... done.");
  } catch (error) {
    LOG_CLI.error(
      `Error: Copying the template to the working directory: ${error}`
    );
    throw LOG_CLI.fatal(new Error(error as string));
  }

  // add the new files to the empty routes dir
  LOG_CLI.debug("Populating routes... done.");
  const newRouteFiles = files.map((file) => {
    const ext = path.extname(file.fsPath);

    const routeFilePath = path.resolve(
      dirs.artifacts.apps.working.routes,
      file.routeFileName.concat(ext)
    );
    return copyFile(file.fsPath, routeFilePath);
  }, []);
  await Promise.all(newRouteFiles);
  LOG_CLI.debug("Populating routes... done.");

  // write the graph and header to the data file
  try {
    LOG_CLI.debug("Writing docs data...");
    const dataContent = `export const graph = ${JSON.stringify(graph, null, 2)};
  export const header = ${JSON.stringify(config.docs.header)};
  `;
    await ensureFile(dirs.artifacts.apps.working.dataFile);
    await writeFile(dirs.artifacts.apps.working.dataFile, dataContent);
    LOG_CLI.debug("Writing docs data... done.");
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }

  LOG_CLI.checkpointEnd("bootstrap");
}
