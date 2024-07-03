import type { ButteryTokensColor } from "@buttery/core";
import type { FC } from "react";
import { LayoutMainPaneSection } from "../../components/layout/LayoutMainPaneSection";

const modeOptions: ButteryTokensColor["mode"][] = ["harmonious", "presets"];

export const ColorPaneSectionSettings: FC<{ color: ButteryTokensColor }> = ({
  color,
}) => {
  return (
    <LayoutMainPaneSection
      btTitle="mode"
      btSubtitle="The mode determines the types of options that can be used to create a color palette. Each mode is designed to ensure complete color harmony regardless of settings."
    >
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
    </LayoutMainPaneSection>
  );
};
