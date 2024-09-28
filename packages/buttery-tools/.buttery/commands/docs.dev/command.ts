import { vitePlugin as butteryDocs } from "@buttery/tools/docs/vite";

import { createServer, defineConfig } from "vite";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands";
// import { bootstrapButteryDocsApp } from "../../../lib/docs/build-utils";
import {
  bootstrapButteryDocsApp,
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
  LOG_CLI.info("Running `buttery.docs.dev` CLI command.");
  const prompt = !options?.["no-prompt"];

  const config = await getButteryDocsConfig({ prompt });
  const dirs = await getButteryDocsDirectories(config);

  await bootstrapButteryDocsApp();

  LOG_CLI.info("Starting development server...");

  try {
    // Create the server
    const viteServer = await createServer({
      configFile: dirs.artifacts.apps.working.viteConfig,
      ...defineConfig({
        plugins: [butteryDocs()],
        server: {
          port: 1600,
          open: true
        }
      })
    });

    await viteServer.listen();
    viteServer.printUrls();
    viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
};
