import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { getButteryConfig } from "@buttery/core";
import { compile } from "../src/util.compile";
import { getDocsDir } from "../src/util.getDocsDir";
import { LOG } from "../src/util.logger";

export const meta: CommandMeta = {
  name: "compile",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template."
};

export const options: CommandOptions<"watch"> = {
  watch: {
    alias: "w",
    description: "Run the build in watch mode",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    const configs = await getButteryConfig("docs");
    const docsDir = getDocsDir(configs.configBase, configs.docs);
    console.log({ docsDir });

    // COMPILE
    await compile({ docsDir });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
