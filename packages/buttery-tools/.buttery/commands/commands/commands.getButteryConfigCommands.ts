import { getButteryConfig } from "../../../lib/config";

export async function getButteryConfigCommands() {
  return getButteryConfig("commands", {
    defaultConfig: "commands"
  });
}
