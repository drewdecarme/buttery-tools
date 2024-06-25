import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG_DOCS } from "../docs/docs.logger";
import { getButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";
import { buildForProduction } from "./docs.build.buildForProduction";
import { prepareBuildDirectory } from "./docs.build.prepareBuildDirectory";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template.",
};

export const options: CommandOptions<"watch"> = {
  watch: {
    alias: "w",
    description: "Run the build in watch mode",
    type: "boolean",
    required: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    const butteryDocsConfig = await getButteryDocsConfig();

    await prepareBuildDirectory(butteryDocsConfig);
    await buildForProduction(butteryDocsConfig);
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
