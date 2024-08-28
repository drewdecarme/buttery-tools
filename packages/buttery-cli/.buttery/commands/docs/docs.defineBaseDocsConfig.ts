import path from "node:path";
import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import { type UserConfig, mergeConfig } from "vite";
import { getButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { mdxTransformCodeExamples } from "./docs.vite-plugin-mdx-code-examples";
import { mdxTransformImports } from "./docs.vite-plugin-mdx-transform-imports";
import { transformMarkdownAssetPath } from "./docs.vite-plugin-transform-markdown-asset-path";
import { watchDocsPlugin } from "./docs.vite-plugin-watch-docs";

export async function getButteryDocsDefineConfig() {
  const butteryDocsConfig = await getButteryDocsConfig();
  const butteryDocsDirs = await getButteryDocsDirectories(butteryDocsConfig);

  // https://vitejs.dev/config/
  const baseConfig: UserConfig = {
    publicDir: butteryDocsDirs.userDocs.public,
    build: {
      outDir: butteryDocsDirs.output.root
    },
    server: {
      port: 1400
    },

    resolve: {
      alias: {
        "@buttery/tokens/docs": path.resolve(
          butteryDocsDirs.artifacts.root,
          "../tokens/.buttery-tokens/docs"
        )
      }
    },
    plugins: [
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"]
        }
      }),
      transformMarkdownAssetPath(),
      // TODO: Fix this
      mdxTransformCodeExamples({
        rootPath: butteryDocsConfig.paths.rootDir
      }),
      mdxTransformImports({
        rootPath: butteryDocsConfig.paths.rootDir
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
      remixCloudflareDevProxy(),
      remix({
        manifest: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true
        }
      }),

      watchDocsPlugin(butteryDocsConfig, butteryDocsDirs)
    ]
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
