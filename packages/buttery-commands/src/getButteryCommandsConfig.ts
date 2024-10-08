import { getButteryConfig } from "@buttery/config";

export async function getButteryCommandsConfig() {
  return getButteryConfig("commands", {
    defaultConfig: "commands",
  });
}
