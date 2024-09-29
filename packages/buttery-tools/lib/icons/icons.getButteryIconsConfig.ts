import { getButteryConfig } from "../config/getButteryConfig";

export async function getButteryIconsConfig() {
  return getButteryConfig("icons", {
    defaultConfig: "icons",
    requireConfig: false
  });
}
