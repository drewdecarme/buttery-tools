import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core";

export type BuildCommandsOptions = {
  watch: boolean;
  local: boolean;
  autofix?: boolean;
};

export type BuildCommandsFunctionArgs = {
  config: ResolvedButteryConfig<"cli">;
  options: BuildCommandsOptions;
};

export type BuildCommandFunction = (
  args: BuildCommandsFunctionArgs
) => Promise<void>;

export const getButteryCliDirectories = (
  config: ResolvedButteryConfig<"cli">
) => {
  return {
    commandsDir: path.resolve(config.paths.butteryDir, "./commands"),
    binDir: path.resolve(config.paths.rootDir, "./bin"),
  };
};
