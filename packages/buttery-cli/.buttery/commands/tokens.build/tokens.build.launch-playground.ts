import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createEsbuildOptions } from "@buttery/utils/esbuild";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { build } from "esbuild";

import { createServer } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import type { ButteryTokensConfig } from "./tokens.config.getButteryTokensConfig";
import { getButteryTokensDirectories } from "./tokens.config.getButteryTokensDirectories";

export async function launchConfigUI(
  config: ButteryTokensConfig,
  options: { isLocal: boolean }
) {
  const dirs = await getButteryTokensDirectories(config, options);

  const PLAYGROUND_SERVER_PORT = 8789;

  // create the  config directory
  await mkdir(dirs.artifacts.tokens.playground.server.config, {
    recursive: true,
  });

  // populate the config
  await writeFile(
    path.resolve(
      dirs.artifacts.tokens.playground.server.config,
      "./config.json"
    ),
    JSON.stringify(config.tokens, null, 2)
  );

  await build(
    createEsbuildOptions({
      entryPoints: [dirs.artifacts.tokens.playground.server.entry],
      outdir: dirs.artifacts.tokens.playground.server.root,
    })
  );

  // start the server
  spawn(
    "node",
    [path.resolve(dirs.artifacts.tokens.playground.server.root, "./index.js")],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        PLAYGROUND_SERVER_CONFIG_SAVE_FILE_PATH: path.resolve(
          config.paths.butteryDir,
          "./config.tokens.ts"
        ),
        PLAYGROUND_SERVER_PORT: PLAYGROUND_SERVER_PORT.toString(),
        PLAYGROUND_SERVER_CONFIG_DIRECTORY: `${dirs.artifacts.tokens.playground.server.config}`,
      },
    }
  );

  // create the server
  const server = await createServer({
    resolve: {
      alias: [
        {
          find: "#buttery/tokens/generated/css",
          replacement: path.resolve(dirs.output.path, "./index.css"),
        },
        {
          find: "#buttery/tokens/playground/css",
          replacement: path.resolve(
            dirs.artifacts.tokens.root,
            "./.buttery-tokens/playground/index.css"
          ),
        },
        {
          find: "#buttery/tokens/playground",
          replacement: path.resolve(
            dirs.artifacts.tokens.root,
            "./.buttery-tokens/playground/index.js"
          ),
        },
      ],
    },
    configFile: false,
    root: dirs.artifacts.tokens.playground.client.root,
    publicDir: dirs.artifacts.tokens.playground.client.public,
    server: {
      port: 1300,
      proxy: {
        "/api": `http://localhost:${PLAYGROUND_SERVER_PORT}`,
      },
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
