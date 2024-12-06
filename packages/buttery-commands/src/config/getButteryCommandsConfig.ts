import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";

import type { ButteryCommandsConfig } from "./_config.utils";
import { getButteryCommandsDirectories } from "./getButteryCommandsDirectories";

type GetButteryCommandsParams = Required<
  Omit<GetButteryConfigOptions<ButteryCommandsConfig>, "defaults">
>;

export type ResolvedButteryCommandsConfig = Awaited<
  ReturnType<typeof getButteryCommandsConfig>
>;

export async function getButteryCommandsConfig({
  logLevel,
  prompt,
}: GetButteryCommandsParams) {
  const { config, paths } = await getButteryConfig<ButteryCommandsConfig>(
    "icons",
    {
      logLevel,
      prompt,
      async onEmpty() {},
      async validate(rawConfig) {},
    }
  );

  const dirs = await getButteryCommandsDirectories(config, paths, {
    logLevel,
  });

  return {
    config,
    paths,
    dirs,
  };
}
