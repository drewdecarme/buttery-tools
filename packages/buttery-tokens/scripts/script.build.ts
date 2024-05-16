import { tokenLogger } from "../utils";

export type BuildOptions = {
  watch: boolean;
  debug: boolean;
};

export const build = async (options: BuildOptions) => {
  tokenLogger.debug("Building buttery tokens...", options);
  tokenLogger.success("Build complete!");
};
