import { getButteryConfig } from "@buttery/core/config";

export async function getButteryCommandsConfig() {
  return getButteryConfig("commands", {
    defaultConfig: "commands",
  });
}
