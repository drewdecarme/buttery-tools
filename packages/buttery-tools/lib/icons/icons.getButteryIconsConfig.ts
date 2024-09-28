import { getButteryConfig } from "../config";

export async function getButteryIconsConfig() {
  return getButteryConfig("icons", {
    defaultConfig: "icons",
    requireConfig: false
  });
}
