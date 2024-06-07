import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandAction, CommandMeta } from "@buttery/cli";
import { getButteryConfig } from "@buttery/core";
import mdx from "@mdx-js/rollup";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import react from "@vitejs/plugin-react";
import type { RouteObject } from "react-router-dom";
import { createServer } from "vite";
import type { ButteryDocsGraph, ButteryDocsGraphValue } from "../src/types";
import { createGraph } from "./_utils/util.createGraph";
import { getRoutePath } from "./_utils/util.getRoutePath";
import { kebabToPascalCase } from "./_utils/util.kebab-to-pascal-case";
import { LOG_DOCS } from "./_utils/util.logger";
import { orderFiles } from "./_utils/util.orderFiles";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const action: CommandAction = async () => {
  try {
    LOG_DOCS.debug("Running pre-development scripts...");
    const configs = await getButteryConfig("docs");
    const rootDir = configs.configBase.root;
    const docsDir = path.resolve(rootDir, "./docs");
    const docsPublicDir = path.resolve(rootDir, "./docs/public");
    const tempDir = path.resolve(rootDir, "./.buttery-docs");

    // create a local temp folder to store some stuff in
    const doesTempDirExist = existsSync(tempDir);
    if (!doesTempDirExist) await mkdir(tempDir);

    // get the files inside of the docs directory
    // and enrich them with some of the data
    const docsDirContents = await readdir(docsDir, {
      recursive: false,
      withFileTypes: true,
    });
    const docsDirFiles = docsDirContents.reduce<
      {
        fsPath: string;
        filename: string;
        routePath: string;
      }[]
    >((accum, dirent) => {
      const isFile = dirent.isFile();
      if (!isFile) return accum;
      const fsPath = dirent.parentPath.concat("/").concat(dirent.name);
      const filename = path.parse(dirent.name).name;
      const routePath = getRoutePath(filename);

      return accum.concat({
        fsPath,
        filename,
        routePath,
      });
    }, []);

    // order the files
    const files = orderFiles({ docsConfig: configs.docs, files: docsDirFiles });
    // const routes = files.map((file) => file.routePath);

    // create the graph
    const docsGraph = await createGraph({
      docsConfig: configs.docs,
      files,
    });
    console.log(JSON.stringify(docsGraph, null, 2));

    const server = await createServer({
      root: path.resolve(import.meta.dirname, "../targets/remix/cloudflare"),
      publicDir: docsPublicDir,
      server: {
        port: 1347,
        fs: {
          strict: false,
        },
      },
      plugins: [
        remixCloudflareDevProxy(),
        mdx(),
        remix({
          routes(defineRoutes) {
            return defineRoutes((route) => {
              route("/", path.resolve(docsDir, "./_index.md"));
            });
          },
        }),
      ],
    });

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    console.log(error);
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
