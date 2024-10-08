import path from "node:path";
import { vitePlugin as remix } from "@remix-run/dev";
import wyw from "@wyw-in-js/vite";
import { createServer } from "vite";
import type { ResolvedButteryConfig } from "../_buttery-config";
import { getButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";
import { launchPlaygroundGetConfig } from "./tokens.launchPlaygroundGetConfig";

export async function launchPlayground(
  config: ResolvedButteryConfig<"tokens">
) {
  // resolve a config and the buttery tokens directories
  const reconciledConfig = await launchPlaygroundGetConfig(config);
  const dirs = await getButteryTokensDirectories(reconciledConfig);

  // create the dev server
  const viteServer = await createServer({
    root: dirs.artifacts.playground.root,
    publicDir: path.resolve(dirs.artifacts.playground.root, "./public"),
    clearScreen: false, // we want to see all of the logs,
    server: {
      port: 1500,
      open: true
    },
    plugins: [
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"]
        }
      }),
      remix({
        manifest: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true
        }
      })
    ]
  });

  // run the dev server
  await viteServer.listen();
  viteServer.printUrls();
  viteServer.bindCLIShortcuts({ print: true });
}
