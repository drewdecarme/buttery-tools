import type { PluginOption } from "vite";

import { buildButteryIcons } from "../../.buttery/commands/icons/icons.buildButteryIcons";
import { getButteryIconsConfig } from "../../.buttery/commands/icons/icons.getButteryIconsConfig";
import { getButteryIconsDirectories } from "../../.buttery/commands/icons/icons.getButteryIconsDirectories";

export default async function vitePluginButteryIcons(): Promise<PluginOption> {
  const config = await getButteryIconsConfig();
  const dirs = await getButteryIconsDirectories(config);

  return {
    name: "buttery-icons",
    resolveId(source) {
      if (source.startsWith("@buttery/icons")) {
        return {
          id: source.replace("@buttery/icons", dirs.output.barrelFile)
        };
      }
      return null;
    },
    async buildStart() {
      await buildButteryIcons();
    }
  };
}
