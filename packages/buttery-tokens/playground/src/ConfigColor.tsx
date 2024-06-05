import type { FC } from "react";
import { ConfigColorProvider } from "./ConfigColor.context";
import { ConfigColorJSON } from "./ConfigColorJSON";
import { ConfigColorMode } from "./ConfigColorMode";
import { ConfigColorPalette } from "./ConfigColorPalette";
import { ConfigColorSelectMode } from "./ConfigColorSelectMode";
import { LayoutMainContent } from "./components/layout/LayoutMainContent";
import { LayoutMainPaneLeft } from "./components/layout/LayoutMainPaneLeft";
import { LayoutMainPaneRight } from "./components/layout/LayoutMainPaneRight";
import { LayoutMainPaneSection } from "./components/layout/LayoutMainPaneSection";

export const ConfigColor: FC = () => {
  return (
    <ConfigColorProvider>
      <LayoutMainPaneLeft>
        <LayoutMainPaneSection
          btTitle="mode"
          btSubtitle="The mode determines the types of options that can be used to create a color palette. Each mode is designed to ensure complete color harmony regardless of settings."
        >
          <ConfigColorSelectMode />
        </LayoutMainPaneSection>
        <ConfigColorMode />
      </LayoutMainPaneLeft>
      <LayoutMainContent>
        <ConfigColorPalette />
      </LayoutMainContent>
      <LayoutMainPaneRight>
        <LayoutMainPaneSection>tabs</LayoutMainPaneSection>
        <LayoutMainPaneSection
          btTitle="graph"
          btSubtitle="The graphical representation of the configuration that has been configured in the left pane."
        >
          <ConfigColorJSON />
        </LayoutMainPaneSection>
      </LayoutMainPaneRight>
    </ConfigColorProvider>
  );
};
