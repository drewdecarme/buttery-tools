import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import { type UserConfig, mergeConfig } from "vite";
import { getButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { mdxImportTransform } from "./docs.vite-plugin-mdx-import-transform";
import { transformMarkdownAssetPath } from "./docs.vite-plugin-transform-markdown-asset-path";
import { watchDocsPlugin } from "./docs.vite-plugin-watch-docs";

export async function getButteryDocsDefineConfig() {
  const butteryDocsConfig = await getButteryDocsConfig();
  const butteryDocsDirs = await getButteryDocsDirectories(butteryDocsConfig);

  // https://vitejs.dev/config/
  const baseConfig: UserConfig = {
    publicDir: butteryDocsDirs.userDocs.public,
    build: {
      outDir: butteryDocsDirs.output.root,
    },
    plugins: [
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
            // @ts-expect-error This is a mismatch from the type-system
            rehypeShiki,
            {
              theme: "dark-plus",
            },
          ],
        ],
      }),
      mdxImportTransform({
        rootPath: butteryDocsConfig.paths.rootDir,
      }),
      watchDocsPlugin(butteryDocsConfig, butteryDocsDirs),
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    ],
  };

  return function defineConfig<T extends UserConfig = UserConfig>(
    fn: (params: {
      butteryDocsConfig: typeof butteryDocsConfig;
      butteryDocsDirs: typeof butteryDocsDirs;
    }) => T
  ) {
    const userConfig = fn({ butteryDocsConfig, butteryDocsDirs });
    return mergeConfig<UserConfig, UserConfig>(baseConfig, userConfig);
  };
}
