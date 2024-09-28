import { type GetButteryConfigOptions, getButteryConfig } from "../../config";
import { LOG_CLI } from "../../logger";

export type ButteryDocsConfig = Awaited<
  ReturnType<typeof getButteryDocsConfig>
>;

/**
 * Fetches the buttery.docs config from the
 * `buttery.config.ts` file
 */
export async function getButteryDocsConfig(options?: GetButteryConfigOptions) {
  LOG_CLI.checkpointStart("config");
  const config = await getButteryConfig("docs", {
    ...options,
    defaultConfig: "docs"
  });
  LOG_CLI.checkpointEnd("config");
  return config;
}
