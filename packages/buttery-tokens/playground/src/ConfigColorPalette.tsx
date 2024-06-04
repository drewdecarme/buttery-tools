import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import type { FC } from "react";
import { useConfigColorContext } from "./ConfigColor.context";
import { ConfigColorPalettePresets } from "./ConfigColorPalettePresets";

export const ConfigColorPalette: FC = () => {
  const { state } = useConfigColorContext();

  switch (state.mode) {
    case "presets":
      return <ConfigColorPalettePresets {...state} />;

    // TODO: Build our the harmonious selection
    case "harmonious":
      return <div>TODO:</div>;

    default:
      return exhaustiveMatchGuard(state);
  }
};
