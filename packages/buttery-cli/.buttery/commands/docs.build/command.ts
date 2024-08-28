import type { CommandAction, CommandMeta } from "../../../lib";
import { bootstrapRemixApp } from "../docs/docs.bootstrapRemixApp";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig";
import { LOG_DOCS } from "../docs/docs.logger";
import { buildForProduction } from "./docs.build.buildForProduction";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template."
};

export const action: CommandAction = async () => {
  try {
    const butteryDocsConfig = await getButteryDocsConfig();

    await bootstrapRemixApp(butteryDocsConfig);

    await buildForProduction(butteryDocsConfig);
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
