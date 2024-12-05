import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";

export async function getButteryIconsConfig(options?: GetButteryConfigOptions) {
  return getButteryConfig("icons", {
    defaultConfig: "icons",
    ...options,
  });
}
