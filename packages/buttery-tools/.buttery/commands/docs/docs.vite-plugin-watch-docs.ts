import { cp } from "node:fs/promises";
import path, { basename } from "node:path";
import chokidar from "chokidar";
import type { Plugin } from "vite";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import type { ButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { LOG_DOCS } from "./docs.logger";
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
          LOG_DOCS.watch(file.concat(" changed..."));
          const filename = basename(file);
          const outFileName =
            filename === "_index"
              ? filename
              : butteryDirs.artifacts.apps.generated.app.routePrefix.concat(
                  filename
                );
          const outFile = path.resolve(
            butteryDirs.artifacts.apps.generated.app.routes,
            outFileName
          );

          try {
            // copy the new file
            LOG_DOCS.debug("Updating document...");
            await cp(file, outFile);
            LOG_DOCS.debug("Updating document... done.");
            // re-create the data for the base loader. This will update the nav
            // if a new file is created
            LOG_DOCS.debug("Re-creating routes...");
            await writeButteryDocsGraphDevData(butteryConfigs);
            LOG_DOCS.debug("Re-creating routes... done.");
          } catch (error) {
            LOG_DOCS.fatal(new Error(error as string));
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
