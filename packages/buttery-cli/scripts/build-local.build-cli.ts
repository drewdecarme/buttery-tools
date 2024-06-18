import { build } from "../.buttery/commands/cli.build/script.build";
import { getLocalBuildArgs } from "./build-local.get-args";

export const buildLocalCLI = () => {
  const localBuildArgs = getLocalBuildArgs();
  return build(localBuildArgs);
};
