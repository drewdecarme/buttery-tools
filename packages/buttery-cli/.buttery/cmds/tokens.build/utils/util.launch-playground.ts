import path from "node:path";
import type { ButteryConfigTokens } from "@buttery/core";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { createServer } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getResolvedVariables } from "./util.get-resolved-config-constants";

export async function launchPlayground(configTokens: ButteryConfigTokens) {
  const { transpiledFilesOutFile, tokensRootPath, transpiledFilesOutDir } =
    await getResolvedVariables(configTokens);

  const playgroundDir = path.resolve(tokensRootPath, "./playground");
  const playgroundPublicDir = path.resolve(playgroundDir, "./public");

  const server = await createServer({
    resolve: {
      alias: [
        {
          find: "@buttery/tokens/generated/css",
          replacement: path.resolve(transpiledFilesOutDir, "./index.css"),
        },
        {
          find: "@buttery/tokens/generated",
          replacement: transpiledFilesOutFile,
        },

        {
          find: "@buttery/tokens/css",
          replacement: path.resolve(
            tokensRootPath,
            "./.tokens/_tokens/index.css"
          ),
        },
        {
          find: "@buttery/tokens",
          replacement: path.resolve(
            tokensRootPath,
            "./.tokens/_tokens/index.ts"
          ),
        },
      ],
    },
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: playgroundDir,
    publicDir: playgroundPublicDir,
    server: {
      port: 1337,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          plugins: ["@babel/plugin-transform-export-namespace-from"],
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    ],
  });
  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
