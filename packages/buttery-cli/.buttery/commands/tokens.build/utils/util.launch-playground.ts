import path from "node:path";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { createServer } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { ButteryTokensConfig } from "../../tokens/tokens.getButteryTokensConfig";
import { getButteryTokensDirectories } from "../../tokens/tokens.getButteryTokensDirectories";

export async function launchPlayground(
  config: ButteryTokensConfig,
  options: { isLocal: boolean }
) {
  const dirs = await getButteryTokensDirectories(config, options);

  const playgroundDir = path.resolve(dirs.root, "./_playground");
  const playgroundPublicDir = path.resolve(playgroundDir, "./public");

  console.log(dirs.root);

  const server = await createServer({
    resolve: {
      alias: [
        {
          find: "#buttery/tokens/playground/css",
          replacement: path.resolve(dirs.root, "./playground/index.css"),
        },
        {
          find: "#buttery/tokens/playground",
          replacement: path.resolve(dirs.root, "./playground/index.ts"),
        },
      ],
    },
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: playgroundDir,
    publicDir: playgroundPublicDir,
    server: {
      port: 1300,
    },
    plugins: [
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
