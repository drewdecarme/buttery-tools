import { cp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import { LOG_DOCS } from "../docs/docs.logger";
import { getButteryDocsFiles } from "../docs/shared.getButteryDocFiles";
import type { ButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/shared.getButteryDocsDirectories";
import { getButteryDocsGraph } from "../docs/shared.getButteryDocsGraph";
import { orderButteryDocFiles } from "../docs/shared.orderButteryDocFiles";

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

    // copy the template to the build dir
    await cp(butteryDirs.build.templateDir, butteryDirs.build.appDir, {
      recursive: true,
    });

    switch (config.docs.build.target) {
      case "cloudflare-pages": {
        // clean the routes
        LOG_DOCS.debug("Cleaning cloudflare pages routes directory...");
        const remixRoutesDir = path.resolve(
          butteryDirs.build.appDir,
          "./app/routes"
        );
        await rm(remixRoutesDir, { recursive: true, force: true });
        LOG_DOCS.debug("Cleaning cloudflare pages routes directory... done.");

        // copy over new routes
        LOG_DOCS.debug("Populating routes directory...");
        await cp(butteryDirs.docs, remixRoutesDir, {
          recursive: true,
        });
        LOG_DOCS.debug("Populating routes directory... done.");

        LOG_DOCS.debug("Creating data file...");
        const dataFilePath = path.resolve(
          butteryDirs.build.appDir,
          "./app/data.ts"
        );
        console.log({ dataFilePath });
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
          butteryDirs.build.appDir,
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
