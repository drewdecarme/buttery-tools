import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";

import {
  ButteryIconsConfig,
  butteryIconsConfigDefaults,
} from "./icons-config.utils";
import { getButteryIconsDirectories } from "./getButteryIconsDirectories";

type GetButteryIconsParams = Required<
  Omit<GetButteryConfigOptions<ButteryIconsConfig>, "defaults">
>;

export type ResolvedButteryIconsConfig = Awaited<
  ReturnType<typeof getButteryIconsConfig>
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
      defaults: butteryIconsConfigDefaults,
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
