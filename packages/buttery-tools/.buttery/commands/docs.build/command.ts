import type { CommandAction, CommandMeta } from "../../../lib/buttery-commands";
import { LOG } from "../_logger/util.ts.logger";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig";
import { buildForProduction } from "./docs.build.buildForProduction";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template."
};

export const action: CommandAction = async () => {
  try {
    const butteryDocsConfig = await getButteryDocsConfig();

    await buildForProduction(butteryDocsConfig);
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
