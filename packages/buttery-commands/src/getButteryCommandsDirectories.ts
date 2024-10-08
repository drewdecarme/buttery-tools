import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/config";
import type { ButteryCLIDirectories } from "./build-commands.utils";

export const getButteryCommandsDirectories = (
  config: ResolvedButteryConfig<"commands">
): ButteryCLIDirectories => {
  const commandsDirName = config.commands.commandsDir ?? "commands";

  return {
    commandsDir: path.resolve(config.paths.butteryDir, `./${commandsDirName}`),
    binDir: path.resolve(config.paths.rootDir, "./bin"),
  };
};
