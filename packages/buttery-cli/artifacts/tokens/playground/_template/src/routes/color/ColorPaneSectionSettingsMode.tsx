import type { ButteryTokensColor } from "@buttery/core";
import {
  butteryConfigColorDefaultsHarmonious,
  butteryConfigColorDefaultsPresets,
} from "@buttery/core/defaults";
import { type ChangeEventHandler, type FC, useCallback } from "react";
import { config } from "#buttery/tokens/playground";

const modeOptions: ButteryTokensColor["mode"][] = ["harmonious", "presets"];

export const ColorSelectMode: FC<{ color: ButteryTokensColor }> = ({
  color,
}) => {
  // const handleChangeMode = useCallback<ChangeEventHandler<HTMLSelectElement>>(
  //   ({ currentTarget: { value } }) => {
  //     const selectedMode = value as ButteryTokensColor["mode"];
  //     setState((prevState) => {
  //       // set the state back to what was configured
  //       if (selectedMode === config.tokens.color.mode) {
  //         return config.tokens.color as ButteryTokensColor;
  //       }
  //       if (selectedMode === "harmonious") {
  //         return butteryConfigColorDefaultsHarmonious;
  //       }
  //       if (selectedMode === "presets") {
  //         return butteryConfigColorDefaultsPresets;
  //       }
  //       return prevState;
  //     });
  //   },
  //   [setState]
  // );

  return (
    <label>
      <div>Select a mode</div>
      <select value={color.mode}>
        {modeOptions.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    </label>
  );
};
