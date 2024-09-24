import path from "node:path";
import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { type UserConfig, mergeConfig } from "vite";
import { getButteryDocsFiles } from "./docs.getButteryDocFiles";
import { getButteryDocsConfig } from "./docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "./docs.getButteryDocsGraph";
import { orderButteryDocFiles } from "./docs.orderButteryDocFiles";
import { mdxTransformCodeExamples } from "./docs.vite-plugin-mdx-code-examples";
// import { mdxTransformCodeExamples } from "./docs.vite-plugin-mdx-code-examples";
import { mdxTransformImports } from "./docs.vite-plugin-mdx-transform-imports";
import { transformMarkdownAssetPath } from "./docs.vite-plugin-transform-markdown-asset-path";
// import { watchDocsPlugin } from "./docs.vite-plugin-watch-docs";

export async function getButteryDocsViteConfig() {
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);

  const baseConfig: UserConfig = {
    root: dirs.artifacts.apps.template.root,
    publicDir: dirs.srcDocs.public,
    resolve: {
      alias: [
        // change the import path to the .buttery/.store
        {
          find: "@buttery/docs/data",
          replacement: dirs.artifacts.apps.template.dataFile
        }
      ]
    },
    optimizeDeps: {
      exclude: ["@buttery/tokens/docs"]
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
      remixCloudflareDevProxy(),
      remix({
        manifest: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true
        },
        routes(defineRoutes) {
          return defineRoutes((route) => {
            // register the index route
            const { _index: indexRoute } = graph;
            route(indexRoute.routeAbs, indexRoute.filepath, { index: true });

            // register the docs layout route
            const docsLayoutPath = path.resolve(
              dirs.artifacts.apps.template.root,
              "./app/routes/_docs.tsx"
            );
            route("", docsLayoutPath, () => {
              // register all of the child routes
              for (const file of orderedFiles) {
                if (file.filename === "_index") continue;

                route(file.routePath, file.fsPath, {
                  index: file.filename.includes("_index")
                });
              }
            });
          });
        }
      })
      // watchDocsPlugin(config, dirs)
    ]
  };

  return function defineConfig<T extends UserConfig = UserConfig>(
    fn: (params: {
      config: typeof config;
      dirs: typeof dirs;
    }) => T
  ) {
    const userConfig = fn({ config, dirs });
    return mergeConfig<UserConfig, UserConfig>(baseConfig, userConfig);
  };
}
