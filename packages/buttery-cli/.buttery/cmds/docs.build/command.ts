import path from "node:path";
import { type InlineConfig, createServer } from "vite";
import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG } from "../_utils/util.logger";
import { getButteryDocsDefineConfig } from "../docs/util.vite.defineBaseDocsConfig";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template.",
};

export const options: CommandOptions<"watch"> = {
  watch: {
    alias: "w",
    description: "Run the build in watch mode",
    type: "boolean",
    required: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    const defineDocsConfig = await getButteryDocsDefineConfig();

    const baseConfig = defineDocsConfig<InlineConfig>(
      ({ butteryDocsDirs }) => ({
        configFile: path.resolve(
          butteryDocsDirs.build.targets["cloudflare-pages"],
          "./vite.config.ts"
        ),
      })
    );

    const server = await createServer(baseConfig);

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    console.log(error);
    throw LOG.fatal(new Error(error as string));
  }
};
