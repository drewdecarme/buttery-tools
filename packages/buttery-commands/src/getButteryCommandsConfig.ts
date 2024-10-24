import { getButteryConfig } from "@buttery/core";

export async function getButteryCommandsConfig() {
  return getButteryConfig("commands", {
    defaultConfig: "commands",
  });
}
