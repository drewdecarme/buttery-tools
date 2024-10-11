import { readFile } from "node:fs/promises";
import path from "node:path";
import { Transform } from "node:stream";
import { ButteryMeta } from "@buttery/meta";
import { findDirectoryUpwards } from "@buttery/utils/node";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import rehypeTOC from "@stefanprobst/rehype-extract-toc";
import rehypeTOCExport from "@stefanprobst/rehype-extract-toc/mdx";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import express from "express";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { createServer } from "vite";
import virtual from "vite-plugin-virtual";
import { getButteryDocsConfig } from "../utils/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../utils/docs.getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "../utils/docs.getButteryDocsRouteManifest";
import { getButteryDocsVirtualModules } from "../utils/docs.getButteryDocsVIrtualModules";
import { LOG } from "../utils/docs.utils";

export async function dev() {
  // Reconcile some variables
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const routeManifest = getButteryDocsRouteManifest(dirs);
  const virtualModules = getButteryDocsVirtualModules(config, routeManifest);

  // create an express app
  const app = express();
  const ABORT_DELAY = 10_000;

  const root = findDirectoryUpwards("node_modules", "react");

  if (!root) {
    throw LOG.fatal(new Error("Cannot locate root node_modules"));
  }

  // create the vite middleware
  const vite = await createServer({
    cacheDir: dirs.app.viteCacheDir,
    root: dirs.app.root, // Root directory for the Vite project
    publicDir: dirs.srcDocs.public,
    appType: "custom", // Avoid Vite's default HTML handling,
    server: {
      middlewareMode: true, // Enable SSR middleware mode
      hmr: {
        port: 3005,
      },
      fs: {
        strict: false,
        allow: [path.resolve(root, "../")],
      },
    },

    clearScreen: false,
    resolve: {
      preserveSymlinks: true,
      extensions: [".js", ".jsx", ".ts", ".tsx", ".mdx"],
      alias: {
        "@docs": dirs.srcDocs.root,
      },
    },
    optimizeDeps: {
      include: [
        "@buttery/logger",
        "react-router-dom",
        "@buttery/components",
        "@buttery/tokens/docs",
        "@buttery/docs-ui",
        "react",
        "react-dom",
        "react-dom/client",
      ],
    },
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [
          rehypeSlug,
          rehypeTOC,
          rehypeTOCExport,
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
      virtual({
        "virtual:data": virtualModules.data,
        "virtual:routes": virtualModules.routes,
      }),
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    ],
  });

  // Add the vite middleware
  app.use(vite.middlewares);

  // Serve the HTML
  app.use("*", async (req, res) => {
    const Meta = new ButteryMeta();

    try {
      const url = req.originalUrl;

      const ssrEntryModule = await vite.ssrLoadModule(dirs.app.appEntryServer);
      const templateFs = await readFile(dirs.app.htmlTemplate, "utf8");
      let htmlTemplate = await vite.transformIndexHtml(url, templateFs);

      const ssrManifest = undefined;
      let didError = false;

      const { pipe, abort } = await ssrEntryModule.render(
        url,
        Meta,
        ssrManifest,
        {
          onShellError() {
            res.status(500);
            res.set({ "Content-Type": "text/html" });
            res.send("<h1>Something went wrong</h1>");
          },
          onAllReady() {
            LOG.debug("App is ready. Streaming SSR...");
            res.status(didError ? 500 : 200);
            res.set({ "Content-Type": "text/html" });

            htmlTemplate = htmlTemplate.replace(
              "<!--ssr-css-->",
              `<link rel="stylesheet" href="${dirs.app.css.tokens}" />
<link rel="stylesheet" href="${dirs.app.css.docsUI}" />
${Meta.renderNodesToString()}
`
            );

            const [htmlStart, htmlEnd] =
              htmlTemplate.split("<!--ssr-outlet-->");

            res.write(htmlStart);

            const transformStream = new Transform({
              transform(chunk, encoding, callback) {
                res.write(chunk, encoding);
                callback();
              },
            });

            transformStream.on("finish", () => {
              res.end(htmlEnd);
            });

            pipe(transformStream);
          },
          onError(error: Error) {
            didError = true;
            console.error(error);
          },
        } as RenderToPipeableStreamOptions
      );

      setTimeout(() => {
        abort();
      }, ABORT_DELAY); // 10 seconds
    } catch (e) {
      const error = e as Error;
      // Handle errors with Vite's SSR stack trace
      vite.ssrFixStacktrace(error);
      LOG.fatal(error);
      res.status(500).end(error.stack);
    }
  });

  app.listen(4000, () => {
    LOG.watch("Local SSR server running at http://localhost:4000");
  });
}
