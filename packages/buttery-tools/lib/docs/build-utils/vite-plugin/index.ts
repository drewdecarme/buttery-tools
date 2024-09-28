import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";
import { vitePlugin as remix } from "@remix-run/dev";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { Plugin } from "vite";

import { bootstrapButteryDocsApp } from "../docs.bootstrapButteryDocsApp";
import { mdxTransformCodeExamples } from "./docs.vite-plugin-mdx-code-examples";
import { mdxTransformImports } from "./docs.vite-plugin-mdx-transform-imports";
import { transformMarkdownAssetPath } from "./docs.vite-plugin-transform-markdown-asset-path";
import { getButteryDocsConfig } from ".buttery/commands/docs/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from ".buttery/commands/docs/docs.getButteryDocsDirectories";

export function vitePluginButteryDocs(): Plugin {
  return {
    name: "vite-plugin-buttery-docs",
    async buildStart() {
      await bootstrapButteryDocsApp();
    },
    async config(viteConfig, env) {
      const config = await getButteryDocsConfig();
      const dirs = await getButteryDocsDirectories(config);

      return {
        root: dirs.artifacts.apps.working.root,
        publicDir: dirs.srcDocs.public,
        clearScreen: false,
        build: {
          manifest: true,
          emptyOutDir: true
        },
        resolve: {
          alias: [
            // change the import path to the .buttery/.store
            {
              find: "~/buttery/docs/data",
              replacement: dirs.artifacts.apps.working.dataFile
            }
          ]
        },
        optimizeDeps: {
          exclude: ["@buttery/tokens/docs"]
        },
        plugins: [
          // TODO: PUtting these here now until a vitePlugins config option
          // is put into the ./.buttery/config
          transformMarkdownAssetPath(),
          mdxTransformImports({
            rootPath: config.paths.rootDir
          }),
          mdxTransformCodeExamples({
            rootPath: config.paths.rootDir
          }),
          wyw({
            include: "/**/*.(ts|tsx)",
            babelOptions: {
              compact: false,
              presets: ["@babel/preset-typescript", "@babel/preset-react"]
            }
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
          config.docs.buildTarget === "cloudflare-pages"
            ? remixCloudflareDevProxy()
            : false,
          remix({
            manifest: true,
            buildDirectory: dirs.output.bundleDir,
            future: {
              v3_fetcherPersist: true,
              v3_relativeSplatPath: true,
              v3_throwAbortReason: true
            }
          })
        ]
      };
    }
  };
}

// routes(defineRoutes) {
//   return defineRoutes((route) => {
//     // register the index route
//     const { _index: indexRoute } = graph;

//     route(indexRoute.routeAbs, indexRoute.filepath, {
//       index: true
//     });

//     // register the docs layout route
//     const docsLayoutPath = path.resolve(
//       dirs.artifacts.apps.template.root,
//       "./app/routes/_docs.tsx"
//     );
//     route("", docsLayoutPath, () => {
//       // register all of the child routes
//       for (const file of orderedFiles) {
//         if (file.filename === "_index") continue;

//         route(file.routePath, file.fsPath, {
//           index: file.filename.includes("_index")
//         });
//       }
//     });
//   });
// }
