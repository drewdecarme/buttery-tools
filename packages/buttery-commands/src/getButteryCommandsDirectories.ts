import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";

export type ButteryCommandsDirectories = ReturnType<
  typeof getButteryCommandsDirectories
>;

export const getButteryCommandsDirectories = (
  config: ResolvedButteryConfig<"commands">
) => {
  const commandsDirName = config.commands.commandsDir ?? "commands";

  return {
    commandsDir: path.resolve(config.paths.butteryDir, `./${commandsDirName}`),
    packageJson: path.resolve(config.paths.rootDir, "./package.json"),
    binDir: path.resolve(config.paths.rootDir, "./bin"),
  };
};
