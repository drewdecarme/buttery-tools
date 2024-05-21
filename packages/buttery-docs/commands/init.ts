import path from "node:path";
import type { CommandAction, CommandMeta } from "@buttery/cli";
import { getButteryConfig } from "@buttery/core";
import { input } from "@inquirer/prompts";

import { LOG } from "../src/util.logger";

export const meta: CommandMeta = {
  name: "init",
  description:
    "Initialize a project with the necessary configurations and files needed to create the Buttery Docs UI"
};

export const action: CommandAction = async () => {
  try {
    const { configBase } = await getButteryConfig();

    // ask some questions
    const relativeDocsFolder = await input({
      message:
        "Where is your docs directory? This is where you will store all of your markdown | mdx files to be compiled for rendering.",
      default: "./docs"
    });

    const docsFolder = path.resolve(configBase.root, relativeDocsFolder);

    console.log({ docsFolder });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
