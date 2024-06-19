import { buildCommands } from "../.buttery/commands/cli.build/build-commands";
import { getLocalBuildOptions } from "./build-local.get-local-build-options";

export const buildLocalCLI = () => {
  const localBuildArgs = getLocalBuildOptions();
  return buildCommands(localBuildArgs);
};
