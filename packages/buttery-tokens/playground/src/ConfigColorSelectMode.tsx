import type { ButteryTokensColor } from "@buttery/core";
import {
  butteryConfigColorDefaultsHarmonious,
  butteryConfigColorDefaultsPresets
} from "@buttery/core/defaults";
import { type ChangeEventHandler, type FC, useCallback } from "react";
import { useConfigColorContext } from "./ConfigColor.context";
import { generatedTokens } from "./tokens-generated";

const modeOptions: ButteryTokensColor["mode"][] = ["harmonious", "presets"];

export const ConfigColorSelectMode: FC = () => {
  const { state, setState } = useConfigColorContext();

  const handleChangeMode = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    ({ currentTarget: { value } }) => {
      const selectedMode = value as ButteryTokensColor["mode"];
      setState((prevState) => {
        // set the state back to what was configured
        if (selectedMode === generatedTokens.config.color.mode) {
          return generatedTokens.config.color as ButteryTokensColor;
        }
        if (selectedMode === "harmonious") {
          return butteryConfigColorDefaultsHarmonious;
        }
        if (selectedMode === "presets") {
          return butteryConfigColorDefaultsPresets;
        }
        return prevState;
      });
    },
    [setState]
  );

  return (
    <label>
      <div>Select a mode</div>
      <select value={state.mode} onChange={handleChangeMode}>
        {modeOptions.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    </label>
  );
};
