import path from "node:path";
import type { CommandAction, CommandMeta } from "../../../lib/types.js";
import { LOG_DOCS } from "../docs/docs.logger.js";
import { getButteryDocsFiles } from "../docs/shared.getButteryDocFiles.js";

import { spawn } from "node:child_process";
import { runCommand } from "../_utils/util.run-command.js";
import { getButteryDocsConfig } from "../docs/shared.getButteryDocsConfig.js";
import { getButteryDocsDirectories } from "../docs/shared.getButteryDocsDirectories.js";
import { getButteryDocsGraph } from "../docs/shared.getButteryDocsGraph.js";
import { orderButteryDocFiles } from "../docs/shared.orderButteryDocFiles.js";
import { createDevServer } from "./util.dev.createDevServer.js";
import { prepareDevDirectory } from "./util.dev.prepareDevDirectory.js";
import { writeButteryDocsGraphDevData } from "./util.dev.writeButteryDocsGraphDevData.js";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const action: CommandAction = async () => {
  try {
    const config = await getButteryDocsConfig();
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
