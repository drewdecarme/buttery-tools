import type { ResolvedButteryConfig } from "@buttery/core/config";
import type { ButteryLogLevel } from "@buttery/core/logger";
// import { vitePlugin as remix } from "@remix-run/dev";
import wyw from "@wyw-in-js/vite";
import { createServer } from "vite";

import path from "node:path";

import { getButteryTokensDirectories } from "./getButteryTokensDirectories";
import { launchPlaygroundGetConfig } from "./launchPlaygroundGetConfig";

export async function launchPlayground(
  config: ResolvedButteryConfig<"tokens">,
  options: { logLevel: ButteryLogLevel }
) {
  // resolve a config and the buttery tokens directories
  const reconciledConfig = await launchPlaygroundGetConfig(config);
  const dirs = await getButteryTokensDirectories(reconciledConfig, options);

  // create the dev server
  const viteServer = await createServer({
    root: dirs.app,
    publicDir: path.resolve(dirs.app, "./public"),
    clearScreen: false, // we want to see all of the logs,
    server: {
      port: 1500,
      open: true,
    },
    plugins: [
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
      // remix({
      //   manifest: true,
      //   future: {
      //     v3_fetcherPersist: true,
      //     v3_relativeSplatPath: true,
      //     v3_throwAbortReason: true,
      //   },
      // }),
    ],
  });

  // run the dev server
  await viteServer.listen();
  viteServer.printUrls();
  viteServer.bindCLIShortcuts({ print: true });
}
