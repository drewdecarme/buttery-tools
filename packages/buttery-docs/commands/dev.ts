import path from "node:path";
import type { CommandAction, CommandMeta } from "@buttery/cli";
import mdx from "@mdx-js/rollup";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
// import rehypeHighlight from "rehype-highlight";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";

import { createServer } from "vite";
import type { ButteryDocsGraph } from "./_utils/types";
import { getButteryDocsConfig } from "./_utils/util.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./_utils/util.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./_utils/util.getButteryDocsGraph";
import { LOG_DOCS } from "./_utils/util.logger";
import { transformMarkdownAssetPath } from "./_utils/vite-plugin-transform-markdown-asset-path";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const action: CommandAction = async () => {
  try {
    LOG_DOCS.debug("Running pre-development scripts...");
    const butteryDocsConfig = await getButteryDocsConfig();
    const butteryDocsGraph = await getButteryDocsGraph(butteryDocsConfig);
    const butteryDocsDirectories = getButteryDocsDirectories(butteryDocsConfig);

    const appTargetsDir = path.resolve(import.meta.dirname, "../targets");
    const rootDir = path.resolve(appTargetsDir, "./remix/cloudflare-pages");

    const server = await createServer({
      root: rootDir,
      publicDir: butteryDocsDirectories.public,
      server: {
        port: 1347,
        fs: {
          strict: false,
        },
      },
      plugins: [
        transformMarkdownAssetPath(),
        remixCloudflareDevProxy(),
        mdx({
          rehypePlugins: [
            [
              rehypeShiki,
              {
                theme: "dark-plus",
                // theme: "material-theme-ocean",
              },
            ],
          ],
        }),
        wyw({
          include: [path.resolve(appTargetsDir, "./**/*.(ts|tsx)")],
          babelOptions: {
            presets: ["@babel/preset-typescript", "@babel/preset-react"],
          },
        }),
        remix({
          routes(defineRoutes) {
            const routes = defineRoutes((route) => {
              function createRouteFromGraph(graph: ButteryDocsGraph) {
                for (const graphValue of Object.values(graph)) {
                  const { routeAbs, filepath, pages } = graphValue;
                  const hasNestedPages = Object.keys(pages).length > 0;

                  // escape the index page
                  if (routeAbs === "/") continue;

                  route(routeAbs, filepath, { index: true });

                  if (hasNestedPages) {
                    // recurse
                    createRouteFromGraph(pages);
                  }
                }
              }
              route(
                "/",
                path.resolve(rootDir, "./app/routes/_index.tsx"),
                () => {
                  createRouteFromGraph(butteryDocsGraph);
                }
              );
            });
            // TODO: put behind a verbose log
            // console.log(routes);
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
