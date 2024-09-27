import { getButteryConfig } from "../_buttery-config";

export async function getButteryConfigCommands() {
  return getButteryConfig("commands", {
    defaultConfig: "commands"
  });
}
