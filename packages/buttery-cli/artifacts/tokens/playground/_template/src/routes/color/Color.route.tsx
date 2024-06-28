import type { ButteryConfigTokens } from "@buttery/core";
import { useLoaderData } from "react-router-dom";
import { LayoutMainContent } from "../../components/layout/LayoutMainContent";
import { LayoutMainPaneLeft } from "../../components/layout/LayoutMainPaneLeft";
import { LayoutMainPaneRight } from "../../components/layout/LayoutMainPaneRight";
import { LayoutMainPaneSection } from "../../components/layout/LayoutMainPaneSection";
import { Tab } from "../../components/tabs/Tab";
import { Tabs } from "../../components/tabs/Tabs";
import { ColorMode } from "./ColorMode";

export const ColorRoute = () => {
  const color = useLoaderData() as ButteryConfigTokens["color"];
  console.log({ color });
  return (
    <>
      <LayoutMainPaneLeft>
        <LayoutMainPaneSection
          btTitle="mode"
          btSubtitle="The mode determines the types of options that can be used to create a color palette. Each mode is designed to ensure complete color harmony regardless of settings."
        >
          {/* <ColorSelectMode /> */}
        </LayoutMainPaneSection>
        <ColorMode />
      </LayoutMainPaneLeft>
      <LayoutMainContent>{/* <ColorPalette /> */}</LayoutMainContent>
      <LayoutMainPaneRight>
        <LayoutMainPaneSection>
          <Tabs btInitActiveTab="graph">
            <Tab btId="graph" btLabel="Graph">
              <LayoutMainPaneSection
                btTitle="graph"
                btSubtitle="The graphical representation of the configuration that has been configured in the left pane."
              >
                {/* <ColorJSON /> */}
              </LayoutMainPaneSection>
            </Tab>
            <Tab btId="other" btLabel="Other">
              Other tab - WIP
            </Tab>
          </Tabs>
        </LayoutMainPaneSection>
      </LayoutMainPaneRight>
    </>
  );
};
