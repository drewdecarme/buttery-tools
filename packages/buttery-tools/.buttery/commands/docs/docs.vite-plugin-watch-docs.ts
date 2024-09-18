import { cp } from "node:fs/promises";
import path, { basename } from "node:path";
import chokidar from "chokidar";
import type { Plugin } from "vite";
import { LOG } from "../_logger/util.ts.logger";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import type { ButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { writeButteryDocsGraphDevData } from "./docs.writeButteryDocsGraphDevData";

// vite-plugin-watch-markdown.js
export function watchDocsPlugin(
  butteryConfigs: ButteryDocsConfig,
  butteryDirs: ButteryDocsDirectories
): Plugin {
  return {
    name: "vite-plugin-watch-docs",
    configureServer(server) {
      const watcher = chokidar.watch(butteryDirs.userDocs.root);

      watcher.on("change", async (file) => {
        if (file.endsWith(".md") || file.endsWith(".mdx")) {
          LOG.watch(file.concat(" changed..."));
          const filename = basename(file);
          const outFileName =
            filename === "_index"
              ? filename
              : butteryDirs.lib.apps.generated.app.routePrefix.concat(filename);
          const outFile = path.resolve(
            butteryDirs.lib.apps.generated.app.routes,
            outFileName
          );

          try {
            // copy the new file
            LOG.debug("Updating document...");
            await cp(file, outFile);
            LOG.debug("Updating document... done.");
            // re-create the data for the base loader. This will update the nav
            // if a new file is created
            LOG.debug("Re-creating routes...");
            await writeButteryDocsGraphDevData(butteryConfigs);
            LOG.debug("Re-creating routes... done.");
          } catch (error) {
            LOG.fatal(new Error(error as string));
          }
        }
      });

      // Ensure chokidar is closed when the server is closed
      server.httpServer?.on("close", () => {
        watcher.close();
      });
    }
  };
}
