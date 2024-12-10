import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";
import { input } from "@inquirer/prompts";

import {
  butteryCommandsConfigSchema,
  type ButteryCommandsConfig,
} from "./_config.utils.js";
import { getButteryCommandsDirectories } from "./getButteryCommandsDirectories.js";
import { defineCommandsConfig } from "./defineCommandsConfig.js";

export type ResolvedButteryCommandsConfig = Awaited<
  ReturnType<typeof getButteryCommandsConfig>
>;

type GetButteryCommandsParams = Required<
  Pick<GetButteryConfigOptions<ButteryCommandsConfig>, "prompt" | "logLevel">
>;

export async function getButteryCommandsConfig({
  logLevel,
  prompt,
}: GetButteryCommandsParams) {
  const { config, paths } = await getButteryConfig<ButteryCommandsConfig>(
    "commands",
    {
      logLevel,
      prompt,
      // TODO: config prefix option
      async onEmpty() {
        const name = await input({
          message:
            "What would you like to name the CLI? (Note: this is also the name you will use to invoke the command from the terminal).",
        });
        const description = await input({
          message: "Please describe in a a sentence the purpose of the CLI.",
        });
        const defaults = await butteryCommandsConfigSchema.parseAsync(
          defineCommandsConfig({
            name,
            description,
          })
        );
        return defaults;
      },
      async validate(rawConfig) {
        const res = await butteryCommandsConfigSchema.safeParseAsync(rawConfig);
        if (res.error) {
          throw res.error;
        }
        return res.data;
      },
    }
  );

  const dirs = getButteryCommandsDirectories(config, paths, {
    logLevel,
  });

  return {
    config,
    paths,
    dirs,
  };
}
