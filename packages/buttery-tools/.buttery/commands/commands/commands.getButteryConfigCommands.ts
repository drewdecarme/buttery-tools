import { getButteryConfig } from "@buttery/config";

export async function getButteryConfigCommands() {
  return getButteryConfig("commands", {
    defaultConfig: "commands",
  });
}
