import path from "node:path";
import mdx from "@mdx-js/rollup";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";
import { vitePlugin as remix } from "@remix-run/dev";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { createServer } from "vite";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/buttery-commands/index.js";
import { LOG } from "../_logger/util.ts.logger.js";
import { bootstrapApp } from "../docs/docs.bootstrapApp.js";
import { bootstrapAppDataFile } from "../docs/docs.bootstrapAppDataFile.js";
import { getButteryDocsFiles } from "../docs/docs.getButteryDocFiles.js";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig.js";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories.js";
import { getButteryDocsGraph } from "../docs/docs.getButteryDocsGraph.js";
import { orderButteryDocFiles } from "../docs/docs.orderButteryDocFiles.js";
import { mdxTransformImports } from "../docs/docs.vite-plugin-mdx-transform-imports.js";
import { transformMarkdownAssetPath } from "../docs/docs.vite-plugin-transform-markdown-asset-path.js";
import { watchDocsPlugin } from "../docs/docs.vite-plugin-watch-docs.js";

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
      root: dirs.lib.apps.generated.root,
      publicDir: dirs.userDocs.public,
      configFile: path.resolve(
        dirs.lib.apps.generated.root,
        "./vite.config.ts"
      ),
      clearScreen: false,
      server: {
        port: 1600,
        open: true
      },
      plugins: [
        wyw({
          include: "/**/*.(ts|tsx)",
          babelOptions: {
            compact: false,
            presets: ["@babel/preset-typescript", "@babel/preset-react"]
          }
        }),
        // TODO: Fix this
        // mdxTransformCodeExamples({
        //   rootPath: butteryDocsConfig.paths.rootDir
        // }),
        mdx({
          remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                headingProperties: {
                  className: "heading"
                }
              }
            ],
            [
              // @ts-expect-error This is a mismatch from the type-system
              rehypeShiki,
              {
                theme: "dark-plus"
              }
            ]
          ]
        }),
        mdxTransformImports({
          rootPath: config.paths.rootDir
        }),
        transformMarkdownAssetPath(),
        remixCloudflareDevProxy(),
        remix({
          manifest: true,
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true
          }
        }),
        watchDocsPlugin(config, dirs),
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
