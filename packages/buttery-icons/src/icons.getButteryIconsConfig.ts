import { getButteryConfig } from "@buttery/config";

export async function getButteryIconsConfig() {
  return getButteryConfig("icons");
}
