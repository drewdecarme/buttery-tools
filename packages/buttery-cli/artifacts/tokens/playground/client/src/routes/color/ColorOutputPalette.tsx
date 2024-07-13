import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import type { FC } from "react";
import { useConfigContext } from "../../features/config";
import { ColorOutputPalettePresets } from "./ColorOutputPalettePresets";

export const ColorOutputPalette: FC = () => {
  const { liveConfig } = useConfigContext();

  switch (liveConfig.color.mode) {
    case "presets":
      return <ColorOutputPalettePresets {...liveConfig.color} />;

    // TODO: Build our the harmonious selection
    case "harmonious":
      return <div>TODO:</div>;

    default:
      return exhaustiveMatchGuard(liveConfig.color);
  }
};
