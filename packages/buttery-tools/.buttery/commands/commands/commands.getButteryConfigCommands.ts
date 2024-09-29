import { getButteryConfig } from "../../../lib/config/getButteryConfig";

export async function getButteryConfigCommands() {
  return getButteryConfig("commands", {
    defaultConfig: "commands"
  });
}
