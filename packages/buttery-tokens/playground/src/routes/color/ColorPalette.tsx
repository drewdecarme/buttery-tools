import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import type { FC } from "react";
import { useColorContext } from "./Color.context";
import { ColorPalettePresets } from "./ColorPalettePresets";

export const ColorPalette: FC = () => {
  const { state } = useColorContext();

  switch (state.mode) {
    case "presets":
      return <ColorPalettePresets {...state} />;

    // TODO: Build our the harmonious selection
    case "harmonious":
      return <div>TODO:</div>;

    default:
      return exhaustiveMatchGuard(state);
  }
};
