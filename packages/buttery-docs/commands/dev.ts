import type { CommandAction, CommandMeta } from "@buttery/cli";
import { createDevServer } from "./_utils/util.dev.createDevServer";
import { prepareDevDirectory } from "./_utils/util.dev.prepareDevDirectory";
import { writeButteryDocsGraphDevData } from "./_utils/util.dev.writeButteryDocsGraphDevData";
import { getButteryDocsConfig } from "./_utils/util.getButteryDocsConfig";
import { LOG_DOCS } from "./_utils/util.logger";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const action: CommandAction = async () => {
  try {
    const butteryConfigs = await getButteryDocsConfig();

    await prepareDevDirectory(butteryConfigs);
    await writeButteryDocsGraphDevData(butteryConfigs);
    const server = await createDevServer(butteryConfigs);

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    console.log(error);
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
