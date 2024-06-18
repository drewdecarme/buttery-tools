import { existsSync } from "node:fs";
import path from "node:path";
import { LOG } from "./logger.js";

export const butteryConfigCheckFile = (butteryDir: string) => {
  const configFilePath = path.join(butteryDir, "config.ts");
  try {
    const doesFileExist = existsSync(configFilePath);

    if (!doesFileExist) {
      throw `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Please add one.`;
    }

    return configFilePath;
  } catch (error) {
    LOG.fatal(new Error(error as string));
    throw error;
  }
};
