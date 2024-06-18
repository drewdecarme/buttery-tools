import { cp, rm } from "node:fs/promises";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./util.getButteryDocsDirectories";

/**
 * Creates a temporary directory that is a hash of the absolute directory
 * path where the docs are imported. Copies the dev templates over to the hashed
 * template directory. Copies all of the docs from the source docs directory to
 * a directory in the hashed directory to enable dynamic importing with vite.
 * https://vitejs.dev/guide/features#dynamic-import
 */
export const prepareDevDirectory = async (config: ButteryDocsConfig) => {
  try {
    const butteryDirs = getButteryDocsDirectories(config);
    // copy the template to the dev dir
    await cp(butteryDirs.dev.templateDir, butteryDirs.dev.rootDir, {
      recursive: true,
    });
    // clean the dev/docs dir
    await rm(butteryDirs.dev.docsDir, { recursive: true });
    // populate the dev/docs dir
    await cp(butteryDirs.docs, butteryDirs.dev.docsDir, {
      recursive: true,
    });
  } catch (error) {
    throw "Failed to copy necessary files to dev directory for development";
  }
};
