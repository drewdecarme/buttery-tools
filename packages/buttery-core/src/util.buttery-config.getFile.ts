import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "./logger.js";

export async function butteryConfigGetFile(butteryDir: string) {
  const configFilePath = path.join(butteryDir, "config.ts");
  try {
    const doesFileExist = existsSync(configFilePath);

    if (!doesFileExist) {
      throw `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Please add one.`;
    }

    const file = await readFile(configFilePath, "utf-8");
    const isFileEmpty = file.length === 0;

    if (isFileEmpty) {
      throw new Error(
        `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Please add your config.`
      );
    }

    return {
      path: configFilePath,
      content: file,
    };
  } catch (error) {
    LOG.fatal(new Error(error as string));
    throw error;
  }
}
