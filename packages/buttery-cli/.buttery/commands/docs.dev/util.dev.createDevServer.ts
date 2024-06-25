import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { getButteryDocsDefineConfig } from "../docs/util.vite.defineBaseDocsConfig";

export const createDevServer = async () => {
  const defineDocsConfig = await getButteryDocsDefineConfig();

  const baseConfig = defineDocsConfig(({ butteryDocsDirs }) => ({
    root: butteryDocsDirs.dev.rootDir,
    server: {
      port: 1400,
    },
    plugins: [react()],
  }));

  const server = await createServer({
    ...baseConfig,
    configFile: false,
  });
  return server;
};
