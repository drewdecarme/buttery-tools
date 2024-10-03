import { readFile } from "node:fs/promises";
import path from "node:path";
import { Transform } from "node:stream";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import express from "express";
import { getButteryDocsVirtualModules } from "lib/docs/docs.getButteryDocsVIrtualModules";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { createServer } from "vite";
import virtual from "vite-plugin-virtual";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands/butter-commands.types";
import { getButteryDocsConfig } from "../../../lib/docs/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../../../lib/docs/docs.getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "../../../lib/docs/docs.getButteryDocsRouteManifest";
import { LOG_CLI } from "../../../lib/logger/loggers";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance"
};

export const options: CommandOptions<{
  "no-prompt": boolean;
}> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "Disables CLI prompts if any configuration values are not expected / well formed.",
    defaultValue: false
  }
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
        port: 3005
      }
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".mdx"],
      alias: {
        "@docs": dirs.srcDocs.root
      }
    },
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]
      }),
      react(),
      virtual({
        "virtual:data": virtualModules.data,
        "virtual:routes": virtualModules.routes
      }),
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"]
        }
      })
    ]
  });

  // Add the vite middleware
  app.use(vite.middlewares);

  // Serve the HTML
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      const templateFs = await readFile(indexHtmlPath, "utf8");
      const template = await vite.transformIndexHtml(url, templateFs);
      const ssrEntryModule = await vite.ssrLoadModule(serverEntryPath);

      const ssrManifest = undefined;
      let didError = false;

      const { pipe, abort } = await ssrEntryModule.render(url, ssrManifest, {
        onShellError() {
          res.status(500);
          res.set({ "Content-Type": "text/html" });
          res.send("<h1>Something went wrong</h1>");
        },
        onShellReady() {
          res.status(didError ? 500 : 200);
          res.set({ "Content-Type": "text/html" });

          const transformStream = new Transform({
            transform(chunk, encoding, callback) {
              res.write(chunk, encoding);
              callback();
            }
          });

          const [htmlStart, htmlEnd] = template.split("<!--ssr-outlet-->");

          res.write(htmlStart);

          transformStream.on("finish", () => {
            res.end(htmlEnd);
          });

          pipe(transformStream);
        },
        onError(error: Error) {
          didError = true;
          console.error(error);
        }
      });

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

  app.listen(3000, () => {
    LOG_CLI.watch("Local SSR server running at http://localhost:3000");
  });
};
