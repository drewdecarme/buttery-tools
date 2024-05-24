import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { getButteryConfig } from "@buttery/core";
import { buildFrameworkRemix } from "./_utils/util.build-framework-remix";
import { createGraph } from "./_utils/util.createGraph";
import { getDocsDir } from "./_utils/util.getDocsDir";
import { LOG_DOCS } from "./_utils/util.logger";

export const meta: CommandMeta = {
  name: "build",
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

    switch (configs.docs.framework) {
      case "remix":
        await buildFrameworkRemix(configs.configBase, configs.docs);
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
