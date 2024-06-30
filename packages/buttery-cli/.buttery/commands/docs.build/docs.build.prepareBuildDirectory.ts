import { copyFile, cp, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import { emptyDir } from "fs-extra";
import { getButteryDocsFiles } from "../docs/docs.getButteryDocFiles";
import type { ButteryDocsConfig } from "../docs/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "../docs/docs.getButteryDocsGraph";
import { LOG_DOCS } from "../docs/docs.logger";
import { orderButteryDocFiles } from "../docs/docs.orderButteryDocFiles";

/**
 * Creates a temporary directory that is a hash of the absolute directory
 * path where the docs are imported. Copies the build templates over to the hashed
 * template directory. Copies all of the docs from the source docs directory to
 * a directory in the hashed directory to enable dynamic importing with vite.
 * https://vitejs.dev/guide/features#dynamic-import
 */
export const prepareBuildDirectory = async (config: ButteryDocsConfig) => {
  try {
    const files = await getButteryDocsFiles(config);
    const orderedFiles = orderButteryDocFiles(config, files);
    const graph = await getButteryDocsGraph(config, orderedFiles);
    const butteryDirs = await getButteryDocsDirectories(config);

    // Create the hashed build directory by copying the template to that directory recursively
    await cp(
      butteryDirs.artifacts.docs.apps.build.template,
      butteryDirs.artifacts.docs.apps.build.dynamicAppRoot,
      {
        recursive: true,
      }
    );

    switch (config.docs.build.target) {
      case "cloudflare-pages": {
        // Delete the entire output directory in the users .buttery/docs directory
        await rm(butteryDirs.output.root, { recursive: true, force: true });
        // clean the routes
        const remixRoutesDir = path.resolve(
          butteryDirs.artifacts.docs.apps.build.dynamicAppRoot,
          "./app/routes"
        );
        LOG_DOCS.debug("Cleaning cloudflare pages routes directory...");
        await emptyDir(remixRoutesDir);
        LOG_DOCS.debug("Cleaning cloudflare pages routes directory... done.");

        // copy over new routes
        LOG_DOCS.debug("Populating routes directory...");
        const filesAndDirs = await readdir(butteryDirs.userDocs.root, {
          withFileTypes: true,
        });
        const docsWithRemixFileConventions = filesAndDirs.reduce<
          Promise<void>[]
        >((accum, dirent) => {
          if (!dirent.isFile()) return accum;
          const filePathSource = `${dirent.parentPath}/${dirent.name}`;
          const fileNameDest =
            dirent.name === "_index.md"
              ? "_index.md"
              : dirent.name
                  .split(".")
                  .reduce<string>((accum, segment, index, origArr) => {
                    if (index === 0) {
                      return segment;
                    }
                    if (index < origArr.length - 1) {
                      return accum.concat("_.".concat(segment));
                    }
                    return accum.concat(".".concat(segment));
                  }, "");

          const filePathDest = path.resolve(remixRoutesDir, fileNameDest);
          return accum.concat(copyFile(filePathSource, filePathDest));
        }, []);
        await Promise.all(docsWithRemixFileConventions);
        LOG_DOCS.debug("Populating routes directory... done.");

        LOG_DOCS.debug("Creating data file...");
        const dataFilePath = path.resolve(
          butteryDirs.artifacts.docs.apps.build.dynamicAppRoot,
          "./app/data.ts"
        );
        await writeFile(
          dataFilePath,
          `import type { ResolvedButteryConfig } from "@buttery/core";
import type { ButteryDocsGraph } from "../../../../.buttery/commands/docs/shared.types";

export const graph: ButteryDocsGraph = ${JSON.stringify(graph, null, 2)};
export const header: ResolvedButteryConfig<"docs">["docs"]["header"] = ${JSON.stringify(config.docs.header)};
`
        );
        LOG_DOCS.debug("Creating data file... done");

        // write a temp package.json
        const packageJsonPath = path.resolve(
          butteryDirs.artifacts.docs.apps.build.dynamicAppRoot,
          "./package.json"
        );
        const packageJsonContent = {
          type: "module",
          dependencies: {
            "@remix-run/cloudflare": "latest",
            isbot: "4.4.0",
          },
        };
        await writeFile(
          packageJsonPath,
          JSON.stringify(packageJsonContent, null, 2)
        );
        break;
      }

      default:
        exhaustiveMatchGuard(config.docs.build.target);
    }

    // // clean the dev/docs dir
    // await rm(butteryDirs.dev.docsDir, { recursive: true, force: true });
    // // populate the dev/docs dir
  } catch (error) {
    throw `Failed to copy necessary files to dev directory for development: ${error}`;
  }
};
