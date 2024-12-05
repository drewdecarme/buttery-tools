import { ensureDir } from "fs-extra";

import path from "node:path";

import { ensureGitIgnoreEntry } from "./ensureGitignoreEntry.js";

import { LOG } from "../private/index.js";


/**
 * Ensures that the `/.buttery/.store` exists. If there is issues ensuring
 * the directory it will store. In addition it will also ensure some entires
 * in the .gitignore file
 *
 * This function will return the resolved filepath
 * of the `/.buttery/.store`.
 */
export async function ensureButteryStore(options: { butteryDir: string }) {
  const butteryStoreDir = path.resolve(options.butteryDir, "./.store");

  // ensure an entry in the .gitignore
  await ensureGitIgnoreEntry(".store", { butteryDir: options.butteryDir });

  try {
    await ensureDir(butteryStoreDir);
    return butteryStoreDir;
  } catch (error) {
    throw LOG.fatal(
      new Error(`Fatal error when resolving the .buttery/.store: ${error}`)
    );
  }
}
