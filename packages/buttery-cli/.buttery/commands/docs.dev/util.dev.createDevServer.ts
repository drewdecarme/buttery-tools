import path from "node:path";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { getButteryDocsDefineConfig } from "../docs/util.vite.defineBaseDocsConfig";

export const createDevServer = async () => {
  const defineDocsConfig = await getButteryDocsDefineConfig();

  const baseConfig = defineDocsConfig(({ butteryDocsDirs }) => ({
    root: butteryDocsDirs.artifacts.docs.apps.dev.dynamicApp.root,
    server: {
      port: 1400,
    },
    resolve: {
      alias: [
        {
          find: "@buttery/tokens/docs",
          replacement: path.resolve(
            butteryDocsDirs.artifacts.root,
            "./tokens/.buttery-tokens/docs"
          ),
        },
      ],
    },
    plugins: [react()],
  }));

  const server = await createServer({
    ...baseConfig,
    configFile: false,
  });
  return server;
};
