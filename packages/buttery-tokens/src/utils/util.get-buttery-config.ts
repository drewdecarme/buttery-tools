import { cosmiconfig } from "cosmiconfig";
import { tokenLogger } from "./util.logger";

/**
 * Searches up the directory structure for where this file is
 * until it finds a config
 */
export const getButteryConfig = async () => {
  const explorer = cosmiconfig("buttery", { searchStrategy: "global" });
  tokenLogger.debug("Searching for `buttery` config...");
  try {
    const config = await explorer.search(import.meta.dirname);
    if (!config) {
      throw "Cannot find the `buttery.config` file to build the tokens. This should not have happened. Please raise a support ticket.";
    }
    if (config.isEmpty) {
      throw "`buttery.config` is empty. This should not have happened. Please raise a support ticket.";
    }
    tokenLogger.debug("Searching for `buttery` config... done.");
    return config.config;
  } catch (error) {
    throw tokenLogger.fatal(new Error(error));
  }
};
