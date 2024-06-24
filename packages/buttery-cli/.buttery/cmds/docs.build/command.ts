import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG } from "../_utils/util.logger";
import { getButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";
import { buildForProduction } from "./_utils/buildForProduction";
import { prepareBuildDirectory } from "./_utils/prepareBuildDirectory";

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
    throw LOG.fatal(new Error(error as string));
  }
};
