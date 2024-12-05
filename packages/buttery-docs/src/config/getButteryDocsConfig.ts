import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";

import { getButteryDocsDirectories } from "./getButteryDocsDirectories";
import {
  ButteryDocsConfig,
  butteryDocsConfigDefaults,
} from "./docs-config.utils";

export type ResolvedButteryDocsConfig = Awaited<
  ReturnType<typeof getButteryDocsConfig>
>;

type GetButteryDocsParams = Required<
  Omit<GetButteryConfigOptions<ButteryDocsConfig>, "defaults">
>;

export async function getButteryDocsConfig({
  logLevel,
  prompt,
}: GetButteryDocsParams) {
  const { config, paths } = await getButteryConfig<ButteryDocsConfig>("docs", {
    logLevel,
    prompt,
    defaults: butteryDocsConfigDefaults,
  });

  const dirs = await getButteryDocsDirectories(config, paths, {
    logLevel,
  });

  return {
    config,
    paths,
    dirs,
  };
}
