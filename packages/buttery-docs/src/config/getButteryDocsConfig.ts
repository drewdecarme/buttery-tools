import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";

import type { ButteryDocsConfig } from "./defineButteryDocsConfig";
import { getButteryDocsDirectories } from "./getButteryDocsDirectories";

export type ResolvedButteryDocsConfig = Awaited<
  ReturnType<typeof getButteryDocsConfig>
>;

export async function getButteryDocsConfig(
  options: Required<
    Omit<GetButteryConfigOptions<ButteryDocsConfig>, "defaults">
  >
) {
  const { config, paths } = await getButteryConfig<ButteryDocsConfig>("docs", {
    ...options,
    defaults: {
      buildTarget: "cloudflare-pages",
    },
  });

  const dirs = await getButteryDocsDirectories(config, paths, {
    logLevel: options.logLevel,
  });

  return {
    config,
    paths,
    dirs,
  };
}
