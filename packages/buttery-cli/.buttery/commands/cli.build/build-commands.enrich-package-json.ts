import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "../_utils/util.logger";
import type { BuildCommandsFunctionArgs } from "./build-commands.utils";

// TODO: Update this description
// -- PACKAGE.JSON --
// In order to invoke the CLI we need to add a few properties
// from the `buttery.config.(mjs|cjs|js)` file into the `package.json`
// file. This will allow whoever consumes the CLI to instantiate it
// from the command line without having to worry about manually adding
// those properties to their `package.json`
export async function buildCommandsEnrichPackageJson({
  configBase,
  configCli,
}: BuildCommandsFunctionArgs) {
  try {
    const packageJsonPath = path.resolve(configBase.root, "./package.json");
    const packageJsonString = await readFile(packageJsonPath, {
      encoding: "utf8",
    });
    const packageJson = JSON.parse(packageJsonString);
    const packageJsonCLIProperties = {
      type: "module",
      types: "./dist/index.d.ts",
      bin: {
        [configCli.name]: "./bin/index.js",
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
      packageJsonPath,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      "utf-8"
    );
  } catch (error) {
    throw new Error(error as string);
  }
}
