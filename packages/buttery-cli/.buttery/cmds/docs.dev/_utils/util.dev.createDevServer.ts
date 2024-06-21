import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { createServer } from "vite";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./util.getButteryDocsDirectories";
import { transformMarkdownAssetPath } from "./vite-plugin-transform-markdown-asset-path";
import { watchDocsPlugin } from "./vite-plugin-watch-docs";

export const createDevServer = async (configs: ButteryDocsConfig) => {
  const butteryDirs = await getButteryDocsDirectories(configs);
  const server = await createServer({
    configFile: false,
    root: butteryDirs.dev.rootDir,
    publicDir: butteryDirs.public,
    server: {
      port: 1400,
    },
    plugins: [
      transformMarkdownAssetPath(),
      watchDocsPlugin(configs, butteryDirs),
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
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
  return server;
};
