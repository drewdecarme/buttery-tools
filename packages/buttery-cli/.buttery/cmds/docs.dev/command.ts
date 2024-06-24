import type { CommandAction, CommandMeta } from "../../../lib/types.js";

import { getButteryDocsConfig } from "../docs/shared.getButteryDocsConfig.js";
import { LOG_DOCS } from "./_utils/util.logger.js";
import { createDevServer } from "./util.dev.createDevServer.js";
import { prepareDevDirectory } from "./util.dev.prepareDevDirectory.js";
import { writeButteryDocsGraphDevData } from "./util.dev.writeButteryDocsGraphDevData.js";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const action: CommandAction = async () => {
  try {
    const butteryConfigs = await getButteryDocsConfig();

    await prepareDevDirectory(butteryConfigs);
    await writeButteryDocsGraphDevData(butteryConfigs);
    const server = await createDevServer();

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    console.log(error);
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
