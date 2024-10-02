import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import express from "express";
import { ensureFile } from "fs-extra";
import { createServer } from "vite";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands/butter-commands.types";
import { getButteryDocsFiles } from "../../../lib/docs/build-utils/docs.getButteryDocFiles";
import { getButteryDocsConfig } from "../../../lib/docs/build-utils/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../../../lib/docs/build-utils/docs.getButteryDocsDirectories";
import { getButteryDocsGraph } from "../../../lib/docs/build-utils/docs.getButteryDocsGraph";
import { orderButteryDocFiles } from "../../../lib/docs/build-utils/docs.orderButteryDocFiles";
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

export const action: CommandAction<typeof options> = async ({ options }) => {
  LOG_CLI.info("Running `buttery.docs.dev` CLI command.");
  const prompt = !options?.["no-prompt"];

  // Reconcile some variables
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);

  const cacheDir = path.resolve(config.paths.storeDir, "./docs/.vite-cache");
  const serverEntryPath = path.resolve(
    dirs.artifacts.apps.template.root,
    "./src/entry-server.tsx"
  );
  const indexHtmlPath = path.resolve(
    dirs.artifacts.apps.template.root,
    "./index.html"
  );

  const [indexRoute, ...docRoutes] = orderedFiles;
  const graphOutputPath = path.resolve(
    config.paths.storeDir,
    "./docs/route-manifest.ts"
  );
  const graphOutputContent = `import type { ButteryDocsGraph, ButteryDocsRoute } from "@buttery/tools/docs";
import type { ButteryConfigDocsHeader } from "@buttery/tools/config";

export const indexRoute: ButteryDocsRoute = ${JSON.stringify(indexRoute, null, 2)};
export const docRoutes: ButteryDocsRoute[] = ${JSON.stringify(docRoutes, null, 2)};
export const allRoutes: ButteryDocsRoute[] = ${JSON.stringify(orderedFiles, null, 2)};
export const routeGraph: ButteryDocsGraph = ${JSON.stringify(graph, null, 2)};
export const dataHeader: ButteryConfigDocsHeader = ${JSON.stringify(config.docs.header, null, 2)};
`;
  await ensureFile(graphOutputPath);
  await writeFile(graphOutputPath, graphOutputContent);

  // create an express app
  const app = express();

  // create the vite middleware
  const vite = await createServer({
    cacheDir,
    root: dirs.artifacts.apps.template.root, // Root directory for the Vite project
    appType: "custom", // Avoid Vite's default HTML handling,
    server: {
      middlewareMode: true, // Enable SSR middleware mode
      hmr: {
        port: 3005
      }
    },
    resolve: {
      alias: {
        __ROUTE_MANIFEST__: graphOutputPath,
        "@BUTTERY_COMPONENT": path.resolve(
          config.paths.rootDir,
          "lib/components"
        )
      }
    },
    plugins: [
      react()
      // wyw({
      //   include: "/**/*.(ts|tsx)",
      //   babelOptions: {
      //     compact: false,
      //     presets: ["@babel/preset-typescript", "@babel/preset-react"]
      //   }
      // })
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
