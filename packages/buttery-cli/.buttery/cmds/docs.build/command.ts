import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG_DOCS } from "../docs.dev/_utils/util.logger";

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
    // const configs = await getButteryConfig("docs");

    LOG_DOCS.success("Build complete.");
  } catch (error) {
    console.log(error);
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
