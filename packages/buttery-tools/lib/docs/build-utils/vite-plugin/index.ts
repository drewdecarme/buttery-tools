import type { PluginOption } from "vite";
// import { getButteryDocsConfig } from "../docs.getButteryDocsConfig";
// import { getButteryDocsDirectories } from "../docs.getButteryDocsDirectories";
// import { getButteryDocsConfig } from "../docs.getButteryDocsConfig";
// import { getButteryDocsDirectories } from "../docs.getButteryDocsDirectories";
// import { mdxTransformCodeExamples } from "./docs.vite-plugin-mdx-code-examples";
// import { mdxTransformImports } from "./docs.vite-plugin-mdx-transform-imports";

import { writeFile } from "node:fs/promises";
import path from "node:path";
import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import rehypeShiki from "@shikijs/rehype";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { getButteryDocsConfig } from "../docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs.getButteryDocsDirectories";
import { mdxTransformCodeExamples } from "./docs.vite-plugin-mdx-code-examples";
import { mdxTransformImports } from "./docs.vite-plugin-mdx-transform-imports";

export async function vitePlugin(options: {
  root: string;
}): Promise<PluginOption[]> {
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);

  console.log(JSON.stringify(config));

  return [
    {
      enforce: "pre",
      name: "buttery-tools",
      config() {
        return {
          root: options.root,
          publicDir: dirs.srcDocs.public,
          cacheDir: path.resolve(
            dirs.artifacts.apps.working.root,
            "./node_modules/.vite"
          ),
          optimizeDeps: {
            exclude: ["fsevents", "@buttery/tokens/docs"],
            include: ["@remix-run/react"]
          },
          // build: {
          //   rollupOptions: {
          //     cache: false // Disable caching to test if it resolves the issue
          //   }
          // },
          clearScreen: false,
          server: {
            open: true
            // watch: {
            //   usePolling: true // Try enabling polling if the issue is related to file watching
            // }
          }
        };
      },
      async resolveId(source, importer, options) {
        console.log(source);
      },
      async configResolved(userConfig) {
        // await optimizeDeps(userConfig, true);

        try {
          await writeFile(
            path.resolve(
              config.paths.storeDir,
              "./docs/resolved-vite-config.json"
            ),
            JSON.stringify(userConfig, null, 2),
            { encoding: "utf8" }
          );
        } catch (error) {}
      }
    },
    {
      name: "buttery-tools-image-path-transform",
      transform(code: string, id: string) {
        if (id.endsWith(".md")) {
          // Replace the ./public with /public URL
          const transformedCode = code.replace(
            /!\[([^\]]*)\]\(\.\/public\/([^)]*)\)/g,
            "![$1](/$2)"
          );
          return {
            code: transformedCode,
            map: null
          };
        }
      }
    },
    mdxTransformImports({
      rootPath: config.paths.rootDir
    }),
    mdxTransformCodeExamples({
      rootPath: config.paths.rootDir
    }),
    // @ts-expect-error I dunno something strange TODO: check into this
    // mdx({
    //   include: path.join(options.root, "**/*.(md|mdx)"),
    //   remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    //   rehypePlugins: [
    //     rehypeSlug,
    //     [
    //       rehypeAutolinkHeadings,
    //       {
    //         behavior: "wrap",
    //         headingProperties: {
    //           className: "heading"
    //         }
    //       }
    //     ],
    //     [
    //       // @ts-expect-error This is a mismatch from the type-system
    //       rehypeShiki,
    //       {
    //         theme: "dark-plus"
    //       }
    //     ]
    //   ]
    // }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }),
    wyw({
      include: "/**/*.(ts|tsx)",
      babelOptions: {
        compact: false,
        presets: ["@babel/preset-typescript", "@babel/preset-react"]
      }
    })
    // {
    //   name: "buttery-docs",
    //   config(userConfig) {
    //     // return {
    //     //   resolve: {
    //     //     preserveSymlinks: true,
    //     //     alias: [
    //     //       // change the import path to the .buttery/.store
    //     //       {
    //     //         find: "~/buttery/docs/data",
    //     //         replacement: path.resolve(dirs.artifacts.apps.working.dataFile)
    //     //       }
    //     //     ]
    //     //   }
    //     // };
    //     return userConfig;
    //   }
    // },
    // remix({
    //   future: {
    //     v3_fetcherPersist: true,
    //     v3_relativeSplatPath: true,
    //     v3_throwAbortReason: true
    //   }
    // })
  ];

  // console.log(`

  //   LOADING BUTTERY DOCS PLUGIN

  //   `);

  // return [
  //   {
  //     name: "buttery-docs",
  //     async config() {
  //       return {
  //         root: options.root,
  //         logLevel: "info",
  //         publicDir: dirs.srcDocs.public,
  //         // cacheDir: path.resolve(options.root, "./node_modules/.vite"),
  //         server: {
  //           port: 1600,
  //           open: true,
  //           fs: {
  //             allow: [
  //               options.root,
  //               path.resolve(options.root, "node_modules") // Ensure node_modules is accessible
  //             ]
  //           }
  //         },
  //         clearScreen: false,
  //         build: {
  //           manifest: true,
  //           emptyOutDir: true,
  //           rollupOptions: {
  //             external: ["fsevents"] // Prevent bundling of `fsevents`
  //           }
  //         },
  //         resolve: {
  //           preserveSymlinks: true,
  //           alias: [
  //             // change the import path to the .buttery/.store
  //             {
  //               find: "~/buttery/docs/data",
  //               replacement: path.resolve(dirs.artifacts.apps.working.dataFile)
  //             }
  //           ]
  //         },
  //         optimizeDeps: {
  //           exclude: ["fsevents"]
  //         },
  //         force: true // Ensure dependencies are optimized in the temp directory
  //       };
  //     },

  //   },
  //   // TODO: PUtting these here now until a vitePlugins config option
  //   // is put into the ./.buttery/config
  //   transformMarkdownAssetPath(),
  //   mdxTransformImports({
  //     rootPath: config.paths.rootDir
  //   }),
  //   mdxTransformCodeExamples({
  //     rootPath: config.paths.rootDir
  //   }),
  //   // @ts-expect-error I dunno something strange TODO: check intot this
  //   mdx({
  //     include: "**/*.(md|mdx)",
  //     remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  //     rehypePlugins: [
  //       rehypeSlug,
  //       [
  //         rehypeAutolinkHeadings,
  //         {
  //           behavior: "wrap",
  //           headingProperties: {
  //             className: "heading"
  //           }
  //         }
  //       ],
  //       [
  //         // @ts-expect-error This is a mismatch from the type-system
  //         rehypeShiki,
  //         {
  //           theme: "dark-plus"
  //         }
  //       ]
  //     ]
  //   }),
  //   // remixCloudflareDevProxy(),
  //   remix({
  //     manifest: true,
  //     buildDirectory: dirs.output.bundleDir,
  //     appDirectory: path.resolve(dirs.artifacts.apps.working.root, "./app"),
  //     future: {
  //       v3_fetcherPersist: true,
  //       v3_relativeSplatPath: true,
  //       v3_throwAbortReason: true,
  //       unstable_optimizeDeps: true
  //     }
  //   }),
  //   wyw({
  //     include: "/**/*.(ts|tsx)",
  //     babelOptions: {
  //       compact: false,
  //       presets: ["@babel/preset-typescript", "@babel/preset-react"]
  //     }
  //   }),
  //   {
  //     name: "dependency-resolver-logger",
  //     configResolved(config) {
  //       console.log("Resolved module paths:", config.resolve.alias);
  //       console.log("Cache Directory:", config.cacheDir);
  //     }
  //   }
  // ];
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
//       dirs.artifacts.apps.working.root,
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
