import type {
  CommandAction,
  CommandMeta,
  CommandOptions,
} from "../../../lib/types.js";
import { LOG_DOCS } from "../docs/docs.logger.js";

import path from "node:path";
import { createServer } from "vite";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig.js";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories.js";
import { prepareRemixApp } from "./docs.dev.prepareRemixApp.js";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const options: CommandOptions<{
  "no-prompt": boolean;
}> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "Disables CLI prompts if any configuration values are not expected / well formed.",
    defaultValue: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  const prompt = !options?.["no-prompt"];

  try {
    const config = await getButteryDocsConfig({ prompt });
    const dirs = await getButteryDocsDirectories(config);

    await prepareRemixApp(config);

    const server = await createServer({
      configFile: path.resolve(
        dirs.artifacts.docs.apps.dev.dynamicApp.root,
        "./vite.config.ts"
      ),
    });

    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
