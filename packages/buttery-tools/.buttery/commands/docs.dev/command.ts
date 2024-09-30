import path from "node:path";
import { createServer } from "vite";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands/butter-commands.types";
import { getButteryDocsConfig } from "../../../lib/docs/build-utils/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../../../lib/docs/build-utils/docs.getButteryDocsDirectories";
import { LOG_CLI } from "../../../lib/logger/loggers";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance"
};

export const options: CommandOptions<{
  "no-prompt": boolean;
}> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "Disables CLI prompts if any configuration values are not expected / well formed.",
    defaultValue: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  LOG_CLI.info("Running `buttery.docs.dev` CLI command.");
  const prompt = !options?.["no-prompt"];

  const config = await getButteryDocsConfig({ prompt });
  const dirs = await getButteryDocsDirectories(config);

  // await bootstrapButteryDocsApp();

  LOG_CLI.info("Starting development server...");

  try {
    const viteServer = await createServer({
      root: dirs.artifacts.apps.template.root,
      configFile: path.resolve(
        dirs.artifacts.apps.template.root,
        "./vite.config.ts"
      ),
      plugins: [
        {
          name: "buttery-tools-debug",
          configResolved(config) {
            console.log(JSON.stringify(config, null, 2));
          }
        }
      ]
    });

    await viteServer.listen();
    viteServer.printUrls();
    viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
};
