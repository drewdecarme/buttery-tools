import { copyFile, cp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "../_logger/util.ts.logger";
import { bootstrapAppDataFile } from "./docs.bootstrapAppDataFile";
import { getButteryDocsFiles } from "./docs.getButteryDocFiles";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./docs.getButteryDocsGraph";
import { orderButteryDocFiles } from "./docs.orderButteryDocFiles";

/**
 * Creates a temporary directory that is a hash of the absolute directory
 * path where the docs are imported. Copies the build templates over to the hashed
 * template directory. Copies all of the docs from the source docs directory to
 * a directory in the hashed directory to enable dynamic importing with vite.
 * https://vitejs.dev/guide/features#dynamic-import
 */
export const bootstrapApp = async (config: ButteryDocsConfig) => {
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);
  const butteryDirs = await getButteryDocsDirectories(config);

  // delete the existing app
  try {
    LOG.debug("Removing existing routes...");
    await rm(butteryDirs.lib.apps.generated.app.routes, {
      recursive: true,
      force: true
    });
    LOG.debug("Removing existing routes... done.");
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }

  // Create the hashed build directory by copying the template to that directory recursively
  try {
    await cp(
      butteryDirs.lib.apps.template.root,
      butteryDirs.lib.apps.generated.root,
      {
        recursive: true
      }
    );

    // add the new files to the empty routes dir
    const newRouteFiles = files.map((file) => {
      const ext = path.extname(file.fsPath);

      const routeFilePath = path.resolve(
        butteryDirs.lib.apps.generated.app.routes,
        file.routeFileName.concat(ext)
      );
      return copyFile(file.fsPath, routeFilePath);
    }, []);
    await Promise.allSettled(newRouteFiles);
    LOG.debug("Populating routes directory with docs... done.");
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }

  // create the data file
  await bootstrapAppDataFile({ config, graph });

  // write a temp package.json
  try {
    const packageJsonPath = path.resolve(
      butteryDirs.lib.apps.generated.root,
      "./package.json"
    );
    const packageJsonContent = {
      type: "module",
      sideEffects: false,
      dependencies: {
        "@remix-run/cloudflare": "latest",
        isbot: "4.4.0"
      }
    };
    const packageJsonString = JSON.stringify(packageJsonContent, null, 2);
    await writeFile(packageJsonPath, packageJsonString);
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }

  LOG.debug("Bootstrapping app... done.");
};
