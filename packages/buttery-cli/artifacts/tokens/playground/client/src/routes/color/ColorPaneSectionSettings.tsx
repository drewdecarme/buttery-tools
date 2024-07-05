import type { ButteryTokensColor } from "@buttery/core";
import type { FC } from "react";
import { LayoutPaneSection } from "../../components/layout/LayoutPaneSection";
import { useConfigContext } from "../../features/config";

const modeOptions: ButteryTokensColor["mode"][] = ["harmonious", "presets"];

export const ColorPaneSectionSettings: FC = () => {
  const { liveConfig } = useConfigContext();
  return (
    <LayoutPaneSection
      btTitle="mode"
      btSubtitle="The mode determines the types of options that can be used to create a color palette. Each mode is designed to ensure complete color harmony regardless of settings."
    >
      <label>
        <div>Select a mode</div>
        <select value={liveConfig.color.mode}>
          {modeOptions.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </label>
    </LayoutPaneSection>
  );
};
