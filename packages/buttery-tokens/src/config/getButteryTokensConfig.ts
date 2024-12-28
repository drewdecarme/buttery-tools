import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";
import { input } from "@inquirer/prompts";
import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";
import { ConfigSchema } from "@buttery/tokens-utils/schemas";

import { getButteryTokensDirectories } from "./getButteryTokensDirectories.js";
import { defineTokensConfig } from "./defineTokensConfig.js";

export type ResolvedButteryTokensConfig = Awaited<
  ReturnType<typeof getButteryTokensConfig>
>;

type GetButteryIconsParams = Required<
  Pick<GetButteryConfigOptions<ButteryTokensConfig>, "prompt" | "logLevel">
>;

export async function getButteryTokensConfig({
  logLevel,
  prompt,
}: GetButteryIconsParams) {
  const { config, paths } = await getButteryConfig<ButteryTokensConfig>(
    "tokens",
    {
      logLevel,
      prompt,
      extension: "json",
      async onEmpty() {
        const namespace = await input({
          message:
            "What namespace would you like to use to import the utils in your app? (e.g. '@buttery/tokens/<your_namespace>')",
        });
        const prefix = await input({
          message:
            "What prefix would you like to use for your CSS tokens? (Prefixing is important in order to ensure that your tokens don't clash with other tokens from 3rd party libraries or stylesheets).",
        });
        const defaults = await ConfigSchema.parseAsync(
          defineTokensConfig({
            runtime: {
              namespace,
              prefix,
            },
          })
        );
        return defaults;
      },
      async validate(rawConfig) {
        const res = await ConfigSchema.safeParseAsync(rawConfig);
        if (res.error) {
          throw res.error;
        }
        return res.data;
      },
    }
  );

  const dirs = await getButteryTokensDirectories(config, paths, {
    logLevel,
  });

  return {
    config,
    paths,
    dirs,
  };
}
