import { getButteryConfig } from "@buttery/core/config";

export async function getButteryIconsConfig() {
  return getButteryConfig("icons");
}
