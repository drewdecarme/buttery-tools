import { cp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import { LOG } from "../../_utils/util.logger";
import type { ButteryDocsConfig } from "../../docs/shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../../docs/shared.getButteryDocsDirectories";

/**
 * Creates a temporary directory that is a hash of the absolute directory
 * path where the docs are imported. Copies the dev templates over to the hashed
 * template directory. Copies all of the docs from the source docs directory to
 * a directory in the hashed directory to enable dynamic importing with vite.
 * https://vitejs.dev/guide/features#dynamic-import
 */
export const prepareBuildDirectory = async (config: ButteryDocsConfig) => {
  try {
    const butteryDirs = await getButteryDocsDirectories(config);

    // copy the template to the dev dir
    await cp(butteryDirs.build.templateDir, butteryDirs.build.appDir, {
      recursive: true,
    });

    switch (config.docs.build.target) {
      case "cloudflare-pages": {
        // clean the routes
        LOG.debug("Cleaning cloudflare pages routes directory...");
        const remixRoutesDir = path.resolve(
          butteryDirs.build.appDir,
          "./app/routes"
        );
        await rm(remixRoutesDir, { recursive: true, force: true });
        LOG.debug("Cleaning cloudflare pages routes directory... done.");

        // copy over new routes
        LOG.debug("Populating routes directory...");
        await cp(butteryDirs.docs, remixRoutesDir, {
          recursive: true,
        });
        LOG.debug("Populating routes directory... done.");

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
