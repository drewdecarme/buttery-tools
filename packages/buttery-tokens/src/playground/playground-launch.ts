import { createServer } from "vite";

import { getPlaygroundViteConfig } from "./playground-get-vite-config.js";

import type { ResolvedButteryTokensConfig } from "../config/getButteryTokensConfig.js";

export async function launchPlayground(rConfig: ResolvedButteryTokensConfig) {
  try {
    // create the dev server
    const viteConfig = getPlaygroundViteConfig(rConfig);
    const viteServer = await createServer(viteConfig);

    // run the dev server
    await viteServer.listen();
    viteServer.printUrls();
    viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw new Error(String(error));
  }
}
