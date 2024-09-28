import { createServer } from "vite";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands";
import {
  getButteryDocsConfig,
  getButteryDocsDirectories
} from "../../../lib/docs/build-utils";
import { LOG_CLI } from "../../../lib/logger";

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
    throw LOG_CLI.fatal(new Error(error as string));
  }
};
