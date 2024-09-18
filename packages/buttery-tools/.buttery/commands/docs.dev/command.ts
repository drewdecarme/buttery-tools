import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/types.js";

import path from "node:path";
import { createServer } from "vite";
import { LOG } from "../_logger/util.ts.logger.js";
import { bootstrapApp } from "../docs/docs.bootstrapApp.js";
import { bootstrapAppDataFile } from "../docs/docs.bootstrapAppDataFile.js";
import { getButteryDocsFiles } from "../docs/docs.getButteryDocFiles.js";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig.js";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories.js";
import { getButteryDocsGraph } from "../docs/docs.getButteryDocsGraph.js";
import { orderButteryDocFiles } from "../docs/docs.orderButteryDocFiles.js";

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

  try {
    const config = await getButteryDocsConfig({ prompt });
    const dirs = await getButteryDocsDirectories(config);

    await bootstrapApp(config);

    const viteServer = await createServer({
      configFile: path.resolve(
        dirs.lib.apps.generated.root,
        "./vite.config.ts"
      ),
      clearScreen: false, // we want to see all of the logs
      plugins: [
        {
          name: "watch-buttery-config",
          configureServer(server) {
            const butteryConfigFilePath = config.paths.config;
            LOG.watch(
              `Watching the '.buttery/config' file for changes: ${butteryConfigFilePath}`
            );
            server.watcher.add(butteryConfigFilePath);
            server.watcher.on("change", async (file) => {
              if (file !== butteryConfigFilePath) return;
              try {
                LOG.watch(`'.buttery/config' file changed. Rebuilding...`);
                const config = await getButteryDocsConfig();
                const files = await getButteryDocsFiles(config);
                const orderedFiles = orderButteryDocFiles(config, files);
                const graph = await getButteryDocsGraph(config, orderedFiles);

                await bootstrapAppDataFile({ config, graph });
              } catch (error) {
                throw LOG.fatal(
                  new Error(
                    `Error when rebuilding the '.buttery/config' file: ${error}`
                  )
                );
              }
            });
          }
        }
      ]
    });

    await viteServer.listen();
    viteServer.printUrls();
    viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
