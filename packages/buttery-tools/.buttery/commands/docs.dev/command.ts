import { createServer } from "vite";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/buttery-commands/index.js";
import { LOG } from "../_logger/util.ts.logger.js";
import { bootstrapButteryDocsApp } from "../docs/docs.bootstrapButteryDocsApp.js";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig.js";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories.js";

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
  const prompt = !options?.["no-prompt"];

  const config = await getButteryDocsConfig({ prompt });
  const dirs = await getButteryDocsDirectories(config);

  await bootstrapButteryDocsApp(config, dirs);

  try {
    // Create the server
    const viteServer = await createServer({
      configFile: dirs.artifacts.apps.working.viteConfig,
      server: {
        port: 1600,
        open: true
      }
    });

    await viteServer.listen();
    viteServer.printUrls();
    viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
