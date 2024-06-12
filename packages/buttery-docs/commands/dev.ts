import path from "node:path";
import type { CommandAction, CommandMeta } from "@buttery/cli";
import { createServer } from "vite";
import { LOG_DOCS } from "./_utils/util.logger";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const action: CommandAction = async () => {
  try {
    const appTargetsDir = path.resolve(import.meta.dirname, "../targets");
    const rootDir = path.resolve(appTargetsDir, "./remix/cloudflare-pages");

    // TODO: Break this up based upon framework

    const server = await createServer({
      configFile: path.resolve(rootDir, "./vite.config.ts"),
    });

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    console.log(error);
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
