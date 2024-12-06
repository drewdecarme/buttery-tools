import { readFile, writeFile } from "node:fs/promises";

import type { ResolvedButteryConfig } from "@buttery/core/config";


import type { ButteryCommandsDirectories } from "../config/getButteryCommandsDirectories";
import { LOG } from "../utils/LOG";

/**
 * Given the commands config reconciled from the .buttery/config
 * this function will add some properties to the package.json file
 * to ensure that it can be invoked using a shebang.
 */
export async function buildPkgJson(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories
) {
  try {
    const packageJsonString = await readFile(dirs.packageJson, {
      encoding: "utf8",
    });
    const packageJson = JSON.parse(packageJsonString);
    const packageJsonCLIProperties = {
      type: "module",
      bin: {
        [config.commands.name]: "./bin/index.js",
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
      dirs.packageJson,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      "utf-8"
    );
  } catch (error) {
    throw new Error(error as string);
  }
}
