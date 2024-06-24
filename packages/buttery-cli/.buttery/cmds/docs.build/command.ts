import path from "node:path";
import { type InlineConfig, createServer } from "vite";
import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG } from "../_utils/util.logger";
import { runCommand } from "../_utils/util.run-command";
import { getButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/shared.getButteryDocsDirectories";
import { getButteryDocsDefineConfig } from "../docs/util.vite.defineBaseDocsConfig";

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
    const butteryDocsDirs = await getButteryDocsDirectories(butteryDocsConfig);

    const configFile = path.resolve(
      butteryDocsDirs.build.targets["cloudflare-pages"],
      "./vite.config.ts"
    );

    await runCommand(`remix vite:build --config ${configFile}`);
  } catch (error) {
    console.log(error);
    throw LOG.fatal(new Error(error as string));
  }
};
