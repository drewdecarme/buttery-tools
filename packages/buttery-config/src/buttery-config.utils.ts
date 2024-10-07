import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { checkbox, input } from "@inquirer/prompts";
import { butteryConfigDefaults } from "./buttery-config.defaults";
import type { ButteryConfig } from "./buttery-config.types";

import { ButteryLogger } from "@buttery/logger";

export const LOG = new ButteryLogger({
  id: "buttery:config",
  prefix: "buttery:config",
  prefixBgColor: "#4c84d5",
  logLevel: "debug",
});

export const exhaustiveMatchGuard = (_: never): never => {
  throw new Error(`Forgot to include an "${_}" in the switch statement`);
};

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
 * should be placed. Returns the resolved .buttery/ directory.
 */
export async function promptUserForButteryDirLocation(
  startingDirectory: string
) {
  const baseDir = await input({
    message: "In what directory would you like to create one?",
    default: startingDirectory,
  });
  const butteryDir = path.resolve(baseDir, "./.buttery");
  return butteryDir;
}

/**
 * Provided a directory and an array of buttery configuration keys,
 * this function creates a default buttery config in the directory
 * with the defaults that map directly to the provided config keys
 */
export async function createDefaultButteryConfigAndDirs(
  butteryDir: string,
  configs: (keyof ButteryConfig)[]
) {
  try {
    // create the necessary dirs and files
    // creates the buttery dir and the nested dirs needed to
    // store the files
    await mkdir(butteryDir, { recursive: true });
    const createButteryDirs = configs.reduce<Promise<void>[]>(
      (accum, configKey) => {
        const dirPath = path.resolve(butteryDir, `./${configKey}`);

        switch (configKey) {
          case "tokens":
          case "icons":
            return accum;

          case "commands": {
            const fn = async () => {
              await mkdir(dirPath, { recursive: true });
            };
            return accum.concat(fn());
          }

          case "docs": {
            const fn = async () => {
              await mkdir(dirPath, { recursive: true });

              const indexFilePath = path.resolve(dirPath, "./_index.md");
              await writeFile(
                indexFilePath,
                `---
title: Home
---

# Home\n`
              );
            };
            return accum.concat(fn());
          }

          default:
            return exhaustiveMatchGuard(configKey);
        }
      },
      []
    );
    await Promise.all(createButteryDirs);

    // crete the buttery/config content
    const butteryConfigPath = path.resolve(butteryDir, "./config.ts");
    const configJson = configs.reduce(
      (accum, config) =>
        Object.assign(accum, {
          [config]: butteryConfigDefaults[config],
        }),
      {}
    );
    const butteryConfigContent = `import type { ButteryConfig } from "@buttery/tools/config"
const config: ButteryConfig = ${JSON.stringify(configJson, null, 2)};
export default config\n`;

    await writeFile(butteryConfigPath, butteryConfigContent, {
      encoding: "utf8",
    });
  } catch (error) {
    throw `Error when trying to create a default ".buttery/config" file: ${error}`;
  }
}
