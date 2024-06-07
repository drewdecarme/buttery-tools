import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { getButteryConfig } from "@buttery/core";
import { buildRemix } from "./_utils/remix";
import { LOG_DOCS } from "./_utils/util.logger";

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
    const configs = await getButteryConfig("docs");

    switch (configs.docs.framework) {
      case "remix":
        await buildRemix(configs.configBase, configs.docs);
        break;

      default:
        break;
    }

    LOG_DOCS.success("Build complete.");
  } catch (error) {
    console.log(error);
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
