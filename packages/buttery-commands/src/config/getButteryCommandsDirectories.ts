import path from "node:path";

import type { ButteryConfigPaths } from "@buttery/core/config";
import type { ButteryLogLevel } from "@buttery/logs";

import type { ButteryCommandsConfig } from "./_config.utils.js";

export type ButteryCommandsDirectories = ReturnType<
  typeof getButteryCommandsDirectories
>;

export const getButteryCommandsDirectories = (
  config: ButteryCommandsConfig,
  paths: ButteryConfigPaths,
  _options: { logLevel: ButteryLogLevel }
) => {
  const commandsDirName = config.commandsDir ?? "commands";
  const binDir = path.resolve(paths.rootDir, "./bin");
  return {
    commandsDir: path.resolve(paths.butteryDir, `./${commandsDirName}`),
    packageJson: path.resolve(paths.rootDir, "./package.json"),
    binDir,
    outDir: path.resolve(binDir, "./commands"),
  };
};
