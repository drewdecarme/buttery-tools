import { cp, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandAction, CommandMeta } from "@buttery/cli";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import { createServer } from "vite";
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
    const butteryConfigs = await getButteryDocsConfig();
    const butteryDirs = getButteryDocsDirectories(butteryConfigs);

    // create a temp directory at the root of the /buttery-docs/.buttery-docs/
    // copy the files from the target.div directory into the temp.dev folder
    // also copy all of the docs to satisfy dynamic importing requirements
    await cp(butteryDirs.dev.templateDir, butteryDirs.dev.rootDir, {
      recursive: true,
    });
    await cp(butteryDirs.docs, butteryDirs.dev.docsDir, { recursive: true });

    // write the routing config
    const graph = await getButteryDocsGraph(butteryConfigs);
    await writeFile(
      path.resolve(butteryDirs.dev.rootDir, "./data.js"),
      `export const graph = ${JSON.stringify(graph, null, 2)};
export const header = ${JSON.stringify(butteryConfigs.docs.header)}\n`
    );

    const server = await createServer({
      configFile: false,
      root: butteryDirs.dev.rootDir,
      server: {
        port: 1400,
      },
      plugins: [
        transformMarkdownAssetPath(),
        wyw({
          include: "./**/*.(ts|tsx)",
          babelOptions: {
            presets: ["@babel/preset-typescript", "@babel/preset-react"],
          },
        }),
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
        react(),
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
