import path from "node:path";
import { cosmiconfig } from "cosmiconfig";
import { tokenLogger } from "./util.logger";

/**
 * Searches up the directory structure starting at the current working directory
 * to find the tokens configuration that is defined by the project that
 * is consuming the package.
 */
export const getTokensConfig = async () => {
  const explorer = cosmiconfig("tokens", { searchStrategy: "global" });
  tokenLogger.debug("Searching for `tokens` config...");
  try {
    const config = await explorer.search(path.resolve(process.cwd()));
    if (!config) {
      throw "Cannot find the `tokens.config` file to build the tokens. This should not have happened. Please raise a support ticket.";
    }
    if (config.isEmpty) {
      throw "`tokens.config` is empty. This should not have happened. Please raise a support ticket.";
    }
    tokenLogger.debug("Searching for `tokens` config... done.");
    return config;
  } catch (error) {
    throw tokenLogger.fatal(new Error(error));
  }
};
