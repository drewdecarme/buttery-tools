import { readFile } from "node:fs/promises";
import path from "node:path";
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
      const ssrModule = await vite.ssrLoadModule(serverEntryPath);
      const appHtml = await ssrModule.render(url);

      const html = template.replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
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
