import { readFile } from "node:fs/promises";
import path from "node:path";
import { Transform } from "node:stream";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import rehypeTOC from "@stefanprobst/rehype-extract-toc";
import rehypeTOCExport from "@stefanprobst/rehype-extract-toc/mdx";
import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import express from "express";
import { getButteryDocsVirtualModules } from "lib/docs/docs.getButteryDocsVIrtualModules";
import { findDirectoryUpwards } from "lib/utils/node";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { createServer } from "vite";
import virtual from "vite-plugin-virtual";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions,
} from "../../../lib/commands/butter-commands.types";
import { getButteryDocsConfig } from "../../../lib/docs/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../../../lib/docs/docs.getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "../../../lib/docs/docs.getButteryDocsRouteManifest";
import { LOG_CLI } from "../../../lib/logger/loggers";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const options: CommandOptions<{
  "no-prompt": boolean;
}> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "Disables CLI prompts if any configuration values are not expected / well formed.",
    defaultValue: false,
  },
};

export const action: CommandAction<typeof options> = async () => {
  LOG_CLI.info("Running `buttery.docs.dev` CLI command.");
  // const prompt = !options?.["no-prompt"];

  // Reconcile some variables
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const routeManifest = getButteryDocsRouteManifest(dirs);
  const virtualModules = getButteryDocsVirtualModules(config, routeManifest);

  const cacheDir = path.resolve(config.paths.storeDir, "./docs/.vite-cache");
  const serverEntryPath = path.resolve(
    dirs.artifacts.apps.template.root,
    "./src/entry-server.tsx"
  );
  const indexHtmlPath = path.resolve(
    dirs.artifacts.apps.template.root,
    "./index.html"
  );

  // create an express app
  const app = express();
  const ABORT_DELAY = 10_000;

  // create the vite middleware
  const vite = await createServer({
    cacheDir,
    root: dirs.artifacts.apps.template.root, // Root directory for the Vite project
    publicDir: dirs.srcDocs.public,
    appType: "custom", // Avoid Vite's default HTML handling,
    server: {
      middlewareMode: true, // Enable SSR middleware mode
      hmr: {
        port: 3005,
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
      include: ["@buttery/components"],
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
    try {
      const url = req.originalUrl;

      const ssrEntryModule = await vite.ssrLoadModule(serverEntryPath);
      const templateFs = await readFile(indexHtmlPath, "utf8");
      let htmlTemplate = await vite.transformIndexHtml(url, templateFs);

      const tokenCSSUrl = path.resolve(
        findDirectoryUpwards("node_modules", "@buttery", {
          startingDirectory: import.meta.dirname,
        }) as string,
        "./tokens/docs/index.css"
      );

      const ssrManifest = undefined;
      let didError = false;

      const { pipe, abort } = await ssrEntryModule.render(url, ssrManifest, {
        onShellError() {
          res.status(500);
          res.set({ "Content-Type": "text/html" });
          res.send("<h1>Something went wrong</h1>");
        },
        onAllReady() {
          res.status(didError ? 500 : 200);
          res.set({ "Content-Type": "text/html" });

          htmlTemplate = htmlTemplate.replace(
            "<!--ssr-css-->",
            `<link rel="stylesheet" href="${tokenCSSUrl}" />`
          );

          const [htmlStart, htmlEnd] = htmlTemplate.split("<!--ssr-outlet-->");

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
      } as RenderToPipeableStreamOptions);

      setTimeout(() => {
        abort();
      }, ABORT_DELAY); // 10 seconds
    } catch (e) {
      const error = e as Error;
      // Handle errors with Vite's SSR stack trace
      vite.ssrFixStacktrace(error);
      LOG_CLI.fatal(error);
      res.status(500).end(error.stack);
    }
  });

  app.listen(4000, () => {
    LOG_CLI.watch("Local SSR server running at http://localhost:4000");
  });
};
