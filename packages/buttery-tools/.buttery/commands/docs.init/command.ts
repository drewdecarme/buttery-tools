import path from "node:path";
import { input, select } from "@inquirer/prompts";

import type { CommandAction, CommandMeta } from "../../../lib/commands";
import { getButteryDocsConfig } from "../../../lib/docs/build-utils";
import { LOG_CLI } from "../../../lib/logger";

export const meta: CommandMeta = {
  name: "init",
  description:
    "Initialize a project with the necessary configurations and files needed to create the Buttery Docs UI"
};

export const action: CommandAction = async () => {
  try {
    const config = await getButteryDocsConfig();

    // ask some questions
    const relativeDocsFolder = await input({
      message:
        "Where is your docs directory? This is where you will store all of your markdown | mdx files to be compiled for rendering.",
      default: "./docs"
    });
    const framework = await select({
      message:
        "Please select a development and build meta framework. This will determine what your build outputs to then be deployed",
      choices: [
        {
          description:
            "Creates your docs using Remix and sets the deployment target for cloudflare-pages",
          value: "remix-cloudflare-pages"
        }
      ]
    });

    const docsFolder = path.resolve(config.paths.rootDir, relativeDocsFolder);

    console.log({ docsFolder, framework });
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
};
