import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";

import type { ButteryIconsConfig } from "./_config.utils.js";
import { butteryIconsConfigSchema } from "./_config.utils.js";
import { getButteryIconsDirectories } from "./getButteryIconsDirectories.js";

export type ResolvedButteryIconsConfig = Awaited<
  ReturnType<typeof getButteryIconsConfig>
>;

type GetButteryIconsParams = Required<
  Pick<GetButteryConfigOptions<ButteryIconsConfig>, "prompt" | "logLevel">
>;

export async function getButteryIconsConfig({
  logLevel,
  prompt,
}: GetButteryIconsParams) {
  const { config, paths } = await getButteryConfig<ButteryIconsConfig>(
    "icons",
    {
      logLevel,
      prompt,
      async onEmpty() {
        const defaults = await butteryIconsConfigSchema.parseAsync({});
        return defaults;
      },
      async validate(rawConfig) {
        const res = await butteryIconsConfigSchema.safeParseAsync(rawConfig);
        if (res.error) {
          throw res.error;
        }
        return res.data;
      },
    }
  );

  const dirs = await getButteryIconsDirectories(config, paths, {
    logLevel,
  });

  return {
    config,
    paths,
    dirs,
  };
}
