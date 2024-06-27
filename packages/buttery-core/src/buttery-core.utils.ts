import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { checkbox, input } from "@inquirer/prompts";
import type { ButteryConfig } from "./types.buttery-config";
import { butteryConfigDefaults } from "./util.butteryConfigDefaults.js";
/**
 * Asks the user to select which keys in the buttery config
 * should create defaults for
 */
export async function promptUserForButteryConfigDefaults({
  message,
  defaultChecked,
}: {
  message: string;
  defaultChecked: keyof ButteryConfig | undefined;
}): Promise<(keyof ButteryConfig)[]> {
  return await checkbox<keyof ButteryConfig>({
    message,
    choices: Object.keys(butteryConfigDefaults).map((key) => ({
      value: key as keyof ButteryConfig,
      checked: key === defaultChecked,
    })),
  });
}

/**
 * Asks the user to write a location for the path of where the buttery directory
 * should be placed
 */
export async function promptUserForButteryDirLocation(
  startingDirectory: string
) {
  return await input({
    message:
      "Cannot locate the `.buttery/config` file in your file structure. In what directory would you like to create one?",
    default: startingDirectory,
  });
}

/**
 * Provided a directory and an array of buttery configuration keys,
 * this function creates a default buttery config in the directory
 * with the defaults that map directly to the provided config keys
 */
export async function createDefaultButteryConfig(
  butteryDir: string,
  configs: (keyof ButteryConfig)[]
) {
  try {
    // create the buttery dir
    await mkdir(butteryDir, { recursive: true });

    // crete the buttery/config content
    const butteryConfigPath = path.resolve(butteryDir, "./config.ts");
    const configJson = configs.reduce(
      (accum, config) =>
        Object.assign(accum, {
          [config]: butteryConfigDefaults[config],
        }),
      {}
    );
    const butteryConfigContent = `import type { ButteryConfig } from "@buttery/core"
const config: ButteryConfig = ${JSON.stringify(configJson, null, 2)};
export default config\n`;

    await writeFile(butteryConfigPath, butteryConfigContent, {
      encoding: "utf8",
    });
  } catch (error) {
    throw `Error when trying to create a default buttery/config file: ${error}`;
  }
}
