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

    // nextx js // TODO: Add next js
    // await prepareDevDirectory(config);
    // const files = await getButteryDocsFiles(config);
    // const orderedFiles = orderButteryDocFiles(config, files);
    // const graph = await getButteryDocsGraph(config, orderedFiles);
    // const dirs = await getButteryDocsDirectories(config);

    // // write the routes
    // const appRouterDir = path.resolve(dirs.dev.rootDir, "./src/app");

    // // await runCommand(`yarn next dev ${dirs.dev.rootDir}`);

    // const nextDev = spawn("yarn", ["next", "dev", dirs.dev.rootDir]); // Replace with your actual command and arguments

    // // Listen for data on stdout
    // nextDev.stdout.on("data", (data) => {
    //   console.log(`${data}`);
    // });

    // // Listen for data on stderr
    // nextDev.stderr.on("data", (data) => {
    //   console.error(`stderr: ${data}`);
    // });

    // TODO: Put this behind a config - This is for react router
    await prepareDevDirectory(config);
    await writeButteryDocsGraphDevData(config);
    const server = await createDevServer();

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    console.log(error);
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
