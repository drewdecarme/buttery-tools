import path from "node:path";
import { mkdir } from "node:fs/promises";

import { LOG } from "../utils/util.logger.js";

/**
 * Ensures that the `/.buttery/.store` exists. If there is issues ensuring
 * the directory it will store.
 *
 * This function will return the resolved filepath
 * of the `/.buttery/.store`.
 */
export async function ensureButteryStore(options: { butteryDir: string }) {
  const butteryStoreDir = path.resolve(options.butteryDir, "./.store");

  try {
    await mkdir(butteryStoreDir, { recursive: true });
    return butteryStoreDir;
  } catch (error) {
    throw LOG.fatal(
      new Error(`Fatal error when resolving the .buttery/.store: ${error}`)
    );
  }
}
