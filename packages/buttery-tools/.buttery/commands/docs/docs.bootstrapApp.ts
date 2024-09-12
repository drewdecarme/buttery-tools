import { copyFile, cp, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import { bootstrapAppDataFile } from "./docs.bootstrapAppDataFile";
import { getButteryDocsFiles } from "./docs.getButteryDocFiles";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./docs.getButteryDocsGraph";
import { LOG_DOCS } from "./docs.logger";
import { orderButteryDocFiles } from "./docs.orderButteryDocFiles";

/**
 * Creates a temporary directory that is a hash of the absolute directory
 * path where the docs are imported. Copies the build templates over to the hashed
 * template directory. Copies all of the docs from the source docs directory to
 * a directory in the hashed directory to enable dynamic importing with vite.
 * https://vitejs.dev/guide/features#dynamic-import
 */
export const bootstrapApp = async (config: ButteryDocsConfig) => {
  try {
    const files = await getButteryDocsFiles(config);
    const orderedFiles = orderButteryDocFiles(config, files);
    const graph = await getButteryDocsGraph(config, orderedFiles);
    const butteryDirs = await getButteryDocsDirectories(config);

    // delete the existing app
    LOG_DOCS.debug("Removing existing routes...");
    await rm(butteryDirs.lib.apps.generated.app.routes, {
      recursive: true,
      force: true
    });
    LOG_DOCS.debug("Removing existing routes... done.");

    // Create the hashed build directory by copying the template to that directory recursively
    await cp(
      butteryDirs.lib.apps.template.root,
      butteryDirs.lib.apps.generated.root,
      {
        recursive: true
      }
    );

    const routesDir = path.resolve(
      butteryDirs.lib.apps.generated.root,
      "./app/routes"
    );

    switch (config.docs.build.target) {
      case "cloudflare-pages": {
        // Delete the entire output directory in the users .buttery/docs directory
        await rm(butteryDirs.output.root, { recursive: true, force: true });

        // copy over new routes
        LOG_DOCS.debug("Populating routes directory with docs...");
        const filesAndDirs = await readdir(butteryDirs.userDocs.root, {
          withFileTypes: true
        });
        const docsWithRemixFileConventions = filesAndDirs.reduce<
          Promise<void>[]
        >((accum, dirent) => {
          if (!dirent.isFile()) return accum;

          // ignore mac specific meta files
          if (dirent.name === ".DS_Store") {
            return accum;
          }
          const filePathSource = `${dirent.parentPath}/${dirent.name}`;
          const fileNameDest =
            dirent.name === "_index.md" || dirent.name === "_index.mdx"
              ? dirent.name
              : dirent.name
                  .split(".")
                  .reduce<string>((accum, segment, index, origArr) => {
                    if (index === 0) {
                      return butteryDirs.lib.apps.generated.app.routePrefix.concat(
                        segment
                      );
                    }
                    if (index < origArr.length - 1) {
                      return accum.concat("_.".concat(segment));
                    }
                    return accum.concat(".".concat(segment));
                  }, "");

          const filePathDest = path.resolve(routesDir, fileNameDest);
          return accum.concat(copyFile(filePathSource, filePathDest));
        }, []);
        await Promise.all(docsWithRemixFileConventions);
        LOG_DOCS.debug("Populating routes directory with docs... done.");

        // write the data file that creates the order, table of contents,
        // and headers
        await bootstrapAppDataFile({ config, graph });

        // write a temp package.json
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
        break;
      }

      default:
        exhaustiveMatchGuard(config.docs.build.target);
    }
  } catch (error) {
    throw `Failed to copy necessary files to dev directory for development: ${error}`;
  }
};
