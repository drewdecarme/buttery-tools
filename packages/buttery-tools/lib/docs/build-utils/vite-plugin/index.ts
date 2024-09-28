import mdx from "@mdx-js/rollup";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";
import { vitePlugin as remix } from "@remix-run/dev";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { Plugin, PluginOption } from "vite";

import { LOG_CLI } from "../../../logger";
import { bootstrapButteryDocsApp } from "../docs.bootstrapButteryDocsApp";
import { getButteryDocsConfig } from "../docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs.getButteryDocsDirectories";
import { mdxTransformCodeExamples } from "./docs.vite-plugin-mdx-code-examples";
import { mdxTransformImports } from "./docs.vite-plugin-mdx-transform-imports";
import { transformMarkdownAssetPath } from "./docs.vite-plugin-transform-markdown-asset-path";

export async function vitePlugin(): Promise<PluginOption[] | undefined> {
  LOG_CLI.debug("Bootstrapping buttery docs application...");
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);

  await bootstrapButteryDocsApp();
  LOG_CLI.debug("Bootstrapping buttery docs application... done.");

  const butteryDocsPlugin: Plugin = {
    name: "vite-plugin-buttery-docs",
    enforce: "pre",
    async config() {
      LOG_CLI.debug("Configuring plugin...");
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
        }
      };
    }
  };

  return [
    butteryDocsPlugin,
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
  ];
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
