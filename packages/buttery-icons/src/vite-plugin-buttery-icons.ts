import type { PluginOption } from "vite";
import { buildButteryIcons } from "./icons.build";
import { getButteryIconsConfig } from "./icons.getButteryIconsConfig";
import { getButteryIconsDirectories } from "./icons.getButteryIconsDirectories";

export default async function vitePluginButteryIcons(): Promise<PluginOption> {
  const config = await getButteryIconsConfig();
  if (!config.icons) return false;

  const dirs = await getButteryIconsDirectories(config);

  return {
    name: "buttery-icons",
    resolveId(source) {
      if (source.startsWith("@buttery/icons")) {
        return {
          id: source.replace("@buttery/icons", dirs.output.barrelFile),
        };
      }
      return null;
    },
    async buildStart() {
      await buildButteryIcons();
    },
  };
}
