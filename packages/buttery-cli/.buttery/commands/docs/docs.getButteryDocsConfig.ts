import {
  type GetButteryConfigOptions,
  getButteryConfig
} from "../_buttery-config/index.js";

export type ButteryDocsConfig = Awaited<
  ReturnType<typeof getButteryDocsConfig>
>;

/**
 * Fetches the buttery.docs config from the
 * `buttery.config.ts` file
 */
export async function getButteryDocsConfig(options?: GetButteryConfigOptions) {
  return await getButteryConfig("docs", options);
}
