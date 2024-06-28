import { cp } from "node:fs/promises";
import path from "node:path";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { createServer } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { ButteryTokensConfig } from "./tokens.config.getButteryTokensConfig";
import { getButteryTokensDirectories } from "./tokens.config.getButteryTokensDirectories";

export async function launchConfigUI(
  config: ButteryTokensConfig,
  options: { isLocal: boolean }
) {
  const dirs = await getButteryTokensDirectories(config, options);

  // create an app from the template and put it into
  // the dynamically reconciled dynamicAppRoot
  await cp(dirs.playground.template, dirs.playground.dynamicAppRoot, {
    recursive: true,
  });

  // create the server
  const server = await createServer({
    resolve: {
      alias: [
        {
          find: "#buttery/tokens/playground/css",
          replacement: path.resolve(dirs.output.path, "./index.css"),
        },
        {
          find: "#buttery/tokens/playground",
          replacement: path.resolve(dirs.output.path, "./index.ts"),
        },
      ],
    },
    configFile: false,
    root: dirs.playground.dynamicAppRoot,
    publicDir: dirs.playground.dynamicAppPublic,
    server: {
      port: 1300,
    },
    plugins: [
      // watch the config and then rebuild the config.data.file
      // {
      //   name: "vite-plugin-config-data",
      //   configureServer(server) {
      //     const watcher = chokidar.watch(file);

      //     watcher.on("change", (path) => {
      //       console.log(`File ${path} has been changed`);
      //       onChange();
      //     });

      //     // Close the watcher when the Vite server is closed
      //     server.watcher.on("close", () => {
      //       watcher.close();
      //     });
      //   },
      // },
      react(),
      tsconfigPaths(),
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    ],
  });
  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
