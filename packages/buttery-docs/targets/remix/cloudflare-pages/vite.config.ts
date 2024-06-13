import path from "node:path";
import mdx from "@mdx-js/rollup";
/**
 * NOTE: This is only here to ensure that the remix
 * functions don't bomb out when running develop. Remix requires
 * that there be a vite config at the root of the project, however
 * we're invoking the `vite.createServer` function using node outside
 * the bounds of the remix CLI... therefore we can just add this here to ensure
 * that the remix vite plugin passes the checks. The vite app will instead
 * run on the
 */
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import chokidar from "chokidar";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";
import type { ButteryDocsGraph } from "../../../commands/_utils/types";
import { getButteryDocsConfig } from "../../../commands/_utils/util.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../../../commands/_utils/util.getButteryDocsDirectories";
import { getButteryDocsGraph } from "../../../commands/_utils/util.getButteryDocsGraph";
import { LOG_DOCS } from "../../../commands/_utils/util.logger";
import { transformMarkdownAssetPath } from "../../../commands/_utils/vite-plugin-transform-markdown-asset-path";

const butteryDocsConfig = await getButteryDocsConfig();
const butteryDocsDirectories = getButteryDocsDirectories(butteryDocsConfig);

// https://vitejs.dev/config/
export default defineConfig({
  root: import.meta.dirname,
  publicDir: butteryDocsDirectories.public,
  server: {
    port: 1347,
    hmr: {
      port: 443,
    },
    fs: {
      strict: false,
    },
  },
  plugins: [
    {
      name: "custom-watcher",
      configureServer(server) {
        const customWatcher = chokidar.watch(butteryDocsDirectories.docs);
        LOG_DOCS.watch(
          `Listening for changes to files in: '${butteryDocsDirectories.docs}'`
        );

        customWatcher.on("change", (path) => {
          LOG_DOCS.info(`"${path}" has changed... reloading.`);
          server.ws.send({
            type: "full-reload",
            path,
          });
        });
      },
    },
    transformMarkdownAssetPath(),
    mdx({
      remarkPlugins: [remarkFrontmatter],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            headingProperties: {
              className: "heading",
            },
          },
        ],
        [
          rehypeShiki,
          {
            theme: "dark-plus",
          },
        ],
      ],
    }),
    wyw({
      include: "/**/*.(ts|tsx)",
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    remixCloudflareDevProxy(),
    remix({
      appDirectory: path.resolve(import.meta.dirname, "./app"),
      async routes(defineRoutes) {
        const butteryDocsGraph = await getButteryDocsGraph(butteryDocsConfig);

        console.log(JSON.stringify(butteryDocsGraph, null, 2));

        const routes = defineRoutes((route) => {
          function createRouteFromGraph(graph: ButteryDocsGraph) {
            for (const graphValue of Object.values(graph)) {
              const { routeAbs, filepath, pages } = graphValue;
              const hasNestedPages = Object.keys(pages).length > 0;

              // escape the index page
              // if (routeAbs === "/") continue;

              route(routeAbs, filepath, { index: true });

              if (hasNestedPages) {
                // recurse
                createRouteFromGraph(pages);
              }
            }
          }
          route(
            "/",
            path.resolve(import.meta.dirname, "./app/routes/_layout.tsx"),
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
