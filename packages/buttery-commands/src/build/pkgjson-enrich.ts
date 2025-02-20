import { readFile, writeFile } from "node:fs/promises";

import type { ResolvedButteryCommandsConfig } from "../config/getButteryCommandsConfig.js";
import { LOG } from "../utils/LOG.js";

/**
 * Given the commands config reconciled from the .buttery/config
 * this function will add some properties to the package.json file
 * to ensure that it can be invoked using a shebang.
 */
export async function buildPkgJson(rConfig: ResolvedButteryCommandsConfig) {
  try {
    const packageJsonString = await readFile(rConfig.dirs.packageJson, {
      encoding: "utf8",
    });
    const packageJson = JSON.parse(packageJsonString);
    const packageJsonCLIProperties = {
      type: "module",
      bin: {
        [rConfig.config.name]: "./bin/index.js",
      },
    };
    const packageJsonPropertiesEntries = Object.entries(
      packageJsonCLIProperties
    );
    for (const [key, value] of packageJsonPropertiesEntries) {
      if (!(key in packageJson)) {
        LOG.debug(`Adding '${key}' to package.json file.`);
        packageJson[key] = value;
      }
    }
    await writeFile(
      rConfig.dirs.packageJson,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      "utf-8"
    );
  } catch (error) {
    throw new Error(error as string);
  }
}
