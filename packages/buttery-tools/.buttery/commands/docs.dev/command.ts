import { viteDev } from "@remix-run/dev/dist/cli/commands.js";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands/butter-commands.types";
import { bootstrapButteryDocsApp } from "../../../lib/docs/build-utils/docs.bootstrapButteryDocsApp";
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

  await bootstrapButteryDocsApp();

  LOG_CLI.info("Starting development server...");

  try {
    // Create the server
    await viteDev(dirs.artifacts.apps.working.root, {
      clearScreen: false,
      port: 1600,
      force: true,
      open: true,
      logLevel: "error"
    });

    // const viteServer = await createServer({
    //   root: dirs.artifacts.apps.working.root,
    //   configFile: dirs.artifacts.apps.working.viteConfig
    // });
    // await viteServer.listen();
    // viteServer.printUrls();
    // viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
};
