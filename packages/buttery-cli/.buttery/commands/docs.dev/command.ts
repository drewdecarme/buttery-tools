import type {
  CommandAction,
  CommandMeta,
  CommandOptions,
} from "../../../lib/types.js";
import { LOG_DOCS } from "../docs/docs.logger.js";

import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig.js";
import { writeButteryDocsGraphDevData } from "../docs/docs.writeButteryDocsGraphDevData.js";
import { createDevServer } from "./docs.dev.createDevServer.js";
import { prepareDevDirectory } from "./docs.dev.prepareDevDirectory.js";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const options: CommandOptions<{
  "no-prompt": boolean;
}> = {
  "no-prompt": {
    type: "boolean",
    defaultValue: false,
    alias: "np",
    description:
      "Disables CLI prompts if any configuration values are not expected / well formed.",
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  const prompt = !options?.["no-prompt"];

  try {
    const config = await getButteryDocsConfig({ prompt });
    await prepareDevDirectory(config);
    await writeButteryDocsGraphDevData(config);
    const server = await createDevServer();

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
