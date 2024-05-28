import path from "node:path";
import type { ButteryConfigTokens } from "@buttery/core";
import { createServer } from "vite";
import { getResolvedVariables } from "../utils/util.get-resolved-config-constants";

export async function launchPlayground(configTokens: ButteryConfigTokens) {
  const { transpiledFilesOutFile, tokensRootPath, transpiledFilesOutDir } =
    await getResolvedVariables(configTokens);

  const server = await createServer({
    resolve: {
      alias: [
        {
          find: "@buttery/tokens/generated/css",
          replacement: path.resolve(transpiledFilesOutDir, "./index.css")
        },
        {
          find: "@buttery/tokens/generated",
          replacement: transpiledFilesOutFile
        },

        {
          find: "@buttery/tokens/css",
          replacement: path.resolve(
            tokensRootPath,
            "./.tokens/_tokens/index.css"
          )
        },
        {
          find: "@buttery/tokens",
          replacement: path.resolve(
            tokensRootPath,
            "./.tokens/_tokens/index.ts"
          )
        }
      ]
    },
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: path.resolve(import.meta.dirname, "../../playground"),
    server: {
      port: 1337
    }
  });
  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
