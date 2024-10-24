import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";
import { LOG } from "./utils";

export type ButteryDocsConfig = Awaited<
  ReturnType<typeof getButteryDocsConfig>
>;

/**
 * Fetches the buttery.docs config from the
 * `buttery.config.ts` file
 */
export async function getButteryDocsConfig(options?: GetButteryConfigOptions) {
  LOG.checkpointStart("config");
  const config = await getButteryConfig("docs", {
    ...options,
    defaultConfig: "docs",
  });
  LOG.checkpointEnd("config");
  return config;
}
