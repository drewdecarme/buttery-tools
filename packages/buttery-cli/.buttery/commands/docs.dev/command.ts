import type {
  CommandAction,
  CommandMeta,
  CommandOptions,
} from "../../../lib/types.js";
import { LOG_DOCS } from "../docs/docs.logger.js";

import { exec } from "node:child_process";
import path from "node:path";
import { cwd } from "node:process";
import { dev as remixViteDevServer } from "@remix-run/dev/dist/vite/dev.js";
import { createRequestHandler } from "@remix-run/express";
import { createServer } from "vite";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig.js";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories.js";
import { prepareRemixApp } from "./docs.dev.prepareRemixApp.js";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const options: CommandOptions<{
  "no-prompt": boolean;
}> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "Disables CLI prompts if any configuration values are not expected / well formed.",
    defaultValue: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  const prompt = !options?.["no-prompt"];

  try {
    const config = await getButteryDocsConfig({ prompt });
    const dirs = await getButteryDocsDirectories(config);

    await prepareRemixApp(config);

    // await remixViteDevServer(dirs.artifacts.docs.apps.dev.dynamicApp.root, {
    //   config: path.resolve(
    //     dirs.artifacts.docs.apps.dev.dynamicApp.root,
    //     "./vite.config.ts"
    //   ),
    // });

    // process.chdir(dirs.artifacts.docs.apps.dev.dynamicApp.root);
    // console.log("Switching to app dir", { cwd: cwd() });
    // exec("npx remix vite:dev", (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error executing command: ${error.message}`);
    //     return;
    //   }

    //   if (stderr) {
    //     console.error(`Error output: ${stderr}`);
    //     return;
    //   }

    //   console.log(stdout);
    // });

    const viteServer = await createServer({
      configFile: path.resolve(
        dirs.artifacts.docs.apps.dev.dynamicApp.root,
        "./vite.config.ts"
      ),
    });

    await viteServer.listen();
    viteServer.printUrls();
    viteServer.bindCLIShortcuts({ print: true });
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
