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
          LOG_DOCS.watch(file.concat(" changed. Updating document..."));
          const filename = basename(file);
          const outFile = path.resolve(
            butteryDirs.artifacts.docs.apps.dev.dynamicApp.root,
            filename
          );
          console.log(outFile);
          // copy the new file
          await cp(file, outFile);
          // re-create the data for the base loader. This will update the nav
          // if a new file is created
          LOG_DOCS.debug("Re-creating routes...");
          await writeButteryDocsGraphDevData(butteryConfigs);
          LOG_DOCS.debug("Re-creating routes... done.");
        }
      });

      // Ensure chokidar is closed when the server is closed
      server.httpServer?.on("close", () => {
        watcher.close();
      });
    },
  };
}
