import path from "node:path";
import { writeFile, readFile } from "node:fs/promises";
import { BuildScriptArgs } from "./script.build";

// TODO: Update this description
// -- PACKAGE.JSON --
// In order to invoke the CLI we need to add a few properties
// from the `buttery.config.(mjs|cjs|js)` file into the `package.json`
// file. This will allow whoever consumes the CLI to instantiate it
// from the command line without having to worry about manually adding
// those properties to their `package.json`
export async function buildPackageJson({ config }: BuildScriptArgs) {
  try {
    const packageJsonPath = path.resolve(config.root, "./package.json");
    const packageJsonString = await readFile(packageJsonPath, {
      encoding: "utf8",
    });
    const packageJson = JSON.parse(packageJsonString);
    const packageJsonCLIProperties = {
      type: "module",
      types: "./dist/index.d.ts",
      bin: {
        [config.name]: "./bin/index.js",
      },
    };
    Object.entries(packageJsonCLIProperties).forEach(([key, value]) => {
      if (!(key in packageJson)) {
        console.log(`Adding '${key}' to package.json file.`);
        packageJson[key] = value;
      }
    });
    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );
  } catch (error) {
    throw new Error(error as string);
  }
}
