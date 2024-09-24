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

  await bootstrapButteryDocsApp({ prompt });

  const config = await getButteryDocsConfig({ prompt });
  const dirs = await getButteryDocsDirectories(config);

  // Create a data file in the .buttery/.store

  try {
    // Create the server
    const viteServer = await createServer({
      configFile: dirs.artifacts.apps.template.viteConfig,
      server: {
        port: 1600,
        open: true
      }

      // watchDocsPlugin(config, dirs)
      // {
      //   name: "watch-buttery-config",
      //   configureServer(server) {
      //     const butteryConfigFilePath = config.paths.config;
      //     LOG.watch(
      //       `Watching the '.buttery/config' file for changes: ${butteryConfigFilePath}`
      //     );
      //     server.watcher.add(butteryConfigFilePath);
      //     server.watcher.on("change", async (file) => {
      //       if (file !== butteryConfigFilePath) return;
      //       try {
      //         LOG.watch(`'.buttery/config' file changed. Rebuilding...`);
      //         const config = await getButteryDocsConfig();
      //         const files = await getButteryDocsFiles(config);
      //         const orderedFiles = orderButteryDocFiles(config, files);
      //         const graph = await getButteryDocsGraph(config, orderedFiles);

      //         await bootstrapAppDataFile({ config, graph });
      //       } catch (error) {
      //         throw LOG.fatal(
      //           new Error(
      //             `Error when rebuilding the '.buttery/config' file: ${error}`
      //           )
      //         );
      //       }
      //     });
      //   }
      // },
      // {
      //   name: "debug",
      //   enforce: "post",
      //   configResolved(resolvedConfig) {
      //     const outpath = path.resolve(
      //       config.paths.storeDir,
      //       "./docs/vite-config.json"
      //     );
      //     ensureFile(outpath).then(() => {
      //       writeFile(outpath, JSON.stringify(resolvedConfig, null, 2));
      //     });
      //   }
      // },
    });

    await viteServer.listen();
    viteServer.printUrls();
    viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
