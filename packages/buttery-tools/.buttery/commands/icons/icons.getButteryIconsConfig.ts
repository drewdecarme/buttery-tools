import { getButteryConfig } from "../_buttery-config";

export async function getButteryIconsConfig() {
  return getButteryConfig("icons", {
    defaultConfig: "icons",
    requireConfig: false
  });
}
