import { cosmiconfig } from "cosmiconfig";
import { tokenLogger } from "./util.logger";

export const getLocalRootPath = async () => {
  try {
    const explorer = cosmiconfig("buttery-tokens", {
      searchStrategy: "global"
    });
    const config = await explorer.search(import.meta.dirname);
    if (!config) {
      throw "Cannot find the local configuration. This should not have happened.";
    }
    return config.filepath.replace(/(.*\/)package\.json$/, "$1");
  } catch (error) {
    const err = new Error(error as string);
    tokenLogger.fatal(err);
    throw err;
  }
};
