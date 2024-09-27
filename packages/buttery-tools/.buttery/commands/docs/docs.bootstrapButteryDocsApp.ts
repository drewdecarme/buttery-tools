import { copyFile, cp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "../_buttery-config";
import { LOG } from "../_logger";
import { getButteryDocsFiles } from "./docs.getButteryDocFiles";
import type { ButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./docs.getButteryDocsGraph";
import { orderButteryDocFiles } from "./docs.orderButteryDocFiles";

/**
 * Bootstraps the entire buttery docs application before either
 * running the development server or building the distribution
 * with Vite.
 */
export async function bootstrapButteryDocsApp(
  config: ResolvedButteryConfig<"docs">,
  dirs: ButteryDocsDirectories
) {
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);

  // copy the template
  try {
    await rm(dirs.artifacts.apps.working.root, {
      recursive: true,
      force: true
    });
    LOG.debug("Copying the template to the working directory...");
    await cp(
      dirs.artifacts.apps.template.root,
      dirs.artifacts.apps.working.root,
      {
        recursive: true
      }
    );
    LOG.debug("Copying the template to the working directory... done.");
  } catch (error) {
    LOG.error(`Error: Copying the template to the working directory: ${error}`);
    throw LOG.fatal(new Error(error as string));
  }

  // add the new files to the empty routes dir
  LOG.debug("Populating routes... done.");
  const newRouteFiles = files.map((file) => {
    const ext = path.extname(file.fsPath);

    const routeFilePath = path.resolve(
      dirs.artifacts.apps.working.routes,
      file.routeFileName.concat(ext)
    );
    return copyFile(file.fsPath, routeFilePath);
  }, []);
  await Promise.all(newRouteFiles);
  LOG.debug("Populating routes... done.");

  // write the graph and header to the data file
  try {
    LOG.debug("Writing docs data...");
    const dataContent = `export const graph = ${JSON.stringify(graph, null, 2)};
  export const header = ${JSON.stringify(config.docs.header)};
  `;
    await writeFile(dirs.artifacts.apps.working.dataFile, dataContent);
    LOG.debug("Writing docs data... done.");
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
