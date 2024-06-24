import { ResolvedButteryConfig } from "@buttery/core";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import { type UserConfig, mergeConfig } from "vite";
import { getButteryDocsConfig } from "./shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./shared.getButteryDocsDirectories";
import { transformMarkdownAssetPath } from "./util.vite.vite-plugin-transform-markdown-asset-path";
import { watchDocsPlugin } from "./util.vite.vite-plugin-watch-docs";

export async function getButteryDocsDefineConfig() {
  const butteryDocsConfig = await getButteryDocsConfig();
  const butteryDocsDirs = await getButteryDocsDirectories(butteryDocsConfig);

  // https://vitejs.dev/config/
  const baseConfig: UserConfig = {
    publicDir: butteryDocsDirs.public,
    build: {
      outDir: butteryDocsDirs.build.outDir,
    },
    plugins: [
      transformMarkdownAssetPath(),
      watchDocsPlugin(butteryDocsConfig, butteryDocsDirs),
      wyw({
        include: "/**/*.(ts|tsx)",
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
    ],
  };

  return function defineConfig(
    fn: (params: {
      butteryDocsConfig: typeof butteryDocsConfig;
      butteryDocsDirs: typeof butteryDocsDirs;
    }) => UserConfig
  ) {
    const userConfig = fn({ butteryDocsConfig, butteryDocsDirs });
    return mergeConfig(baseConfig, userConfig);
  };
}
