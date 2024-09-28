import mdx from "@mdx-js/rollup";

import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
// import { watchDocsPlugin } from "./docs.vite-plugin-watch-docs";
import { type UserConfig, mergeConfig } from "vite";
import { mdxTransformCodeExamples } from "../../../lib/docs/build-utils/vite-plugin/docs.vite-plugin-mdx-code-examples";
import { mdxTransformImports } from "../../../lib/docs/build-utils/vite-plugin/docs.vite-plugin-mdx-transform-imports";
import { transformMarkdownAssetPath } from "../../../lib/docs/build-utils/vite-plugin/docs.vite-plugin-transform-markdown-asset-path";
// import butteryIcons from "../../../artifacts/buttery-icons/vite-plugin-buttery-icons";
// import { watchDocsPlugin } from "./docs.vite-plugin-watch-docs";
import { getButteryDocsFiles } from "./docs.getButteryDocFiles";
import { getButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./docs.getButteryDocsGraph";
import { orderButteryDocFiles } from "./docs.orderButteryDocFiles";

export async function getButteryDocsViteConfig() {
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);

  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);

  const baseConfig: UserConfig = {
    plugins: [
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"]
        }
      }),
      transformMarkdownAssetPath(),
      mdxTransformImports({
        rootPath: config.paths.rootDir
      }),
      mdxTransformCodeExamples({
        rootPath: config.paths.rootDir
      }),
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
      // await butteryIcons()

      watchDocsPlugin(config, dirs)
    ]
  };

  return function defineConfig<T extends UserConfig = UserConfig>(
    fn: (params: {
      config: typeof config;
      dirs: typeof dirs;
      orderedFiles: typeof orderedFiles;
      graph: typeof graph;
    }) => T
  ) {
    const userConfig = fn({ config, dirs, orderedFiles, graph });
    return mergeConfig<UserConfig, UserConfig>(baseConfig, userConfig);
  };
}
