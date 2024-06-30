import { cp, rm } from "node:fs/promises";
import type { ButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/shared.getButteryDocsDirectories";

/**
 * Creates a temporary directory that is a hash of the absolute directory
 * path where the docs are imported. Copies the dev templates over to the hashed
 * template directory. Copies all of the docs from the source docs directory to
 * a directory in the hashed directory to enable dynamic importing with vite.
 * https://vitejs.dev/guide/features#dynamic-import
 */
export const prepareDevDirectory = async (config: ButteryDocsConfig) => {
  try {
    const butteryDirs = await getButteryDocsDirectories(config);
    // copy the template to the dev dir
    await cp(
      butteryDirs.artifacts.docs.apps.dev.template,
      butteryDirs.artifacts.docs.apps.dev.dynamicApp.root,
      {
        recursive: true,
      }
    );
    // clean the dev/docs dir
    await rm(butteryDirs.artifacts.docs.apps.dev.dynamicApp.docs, {
      recursive: true,
      force: true,
    });
    // populate the dev/docs dir
    await cp(
      butteryDirs.userDocs.root,
      butteryDirs.artifacts.docs.apps.dev.dynamicApp.docs,
      {
        recursive: true,
      }
    );
  } catch (error) {
    throw `Failed to copy necessary files to dev directory for development: ${error}`;
  }
};
