import path from "node:path";
import { vitePlugin as remix } from "@remix-run/dev";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";

import { getButteryDocsDefineConfig } from "../../../../.buttery/commands/docs/util.vite.defineBaseDocsConfig";

const defineDocsConfig = await getButteryDocsDefineConfig();

// https://vitejs.dev/config/
export default defineDocsConfig(({ butteryDocsDirs }) => ({
  // change the root here since we're looking at this directory
  root: import.meta.dirname,
  resolve: {
    alias: {
      "@buttery/tokens/docs": path.resolve(
        butteryDocsDirs.artifacts.root,
        "./tokens/.buttery-tokens/docs"
      ),
    },
  },
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      appDirectory: path.resolve(import.meta.dirname, "./app"),
    }),
  ],
}));
