import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import type { CommandAction, CommandMeta } from "@buttery/cli";
import { getButteryConfig } from "@buttery/core";
import mdx from "@mdx-js/rollup";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { createServer } from "vite";
import type { ButteryDocsGraph } from "../src/types";
import { createGraph } from "./_utils/util.createGraph";
import { getRoutePath } from "./_utils/util.getRoutePath";
import { LOG_DOCS } from "./_utils/util.logger";
import { orderFiles } from "./_utils/util.orderFiles";
import { transformMarkdownAssetPath } from "./_utils/vite-plugin-transform-markdown-asset-path";

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

    // create the graph
    const docsGraph = await createGraph({
      docsConfig: configs.docs,
      files,
    });

    const server = await createServer({
      root: path.resolve(
        import.meta.dirname,
        "../targets/remix/cloudflare-pages"
      ),
      publicDir: docsPublicDir,
      resolve: {
        alias: {
          "./public": "/",
        },
      },
      server: {
        port: 1347,
        fs: {
          strict: false,
        },
      },
      plugins: [
        transformMarkdownAssetPath(),
        remixCloudflareDevProxy(),
        mdx(),
        remix({
          routes(defineRoutes) {
            const routes = defineRoutes((route) => {
              function createRouteFromGraph(graph: ButteryDocsGraph) {
                for (const graphValue of Object.values(graph)) {
                  const { routeAbs, filepath, pages } = graphValue;

                  route(routeAbs, filepath);

                  const hasNestedPages = Object.keys(pages).length > 0;
                  if (hasNestedPages) {
                    // recurse
                    createRouteFromGraph(pages);
                  }
                }
              }
              createRouteFromGraph(docsGraph);
            });
            // TODO: put behind a verbose log
            return routes;
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
