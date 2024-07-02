import type { ButteryConfigTokens } from "@buttery/core";
import { useLoaderData } from "react-router-dom";
import { LayoutMainContent } from "../../components/layout/LayoutMainContent";
import { LayoutMainPaneLeft } from "../../components/layout/LayoutMainPaneLeft";
import { LayoutMainPaneSection } from "../../components/layout/LayoutMainPaneSection";
import { Tab } from "../../components/tabs/Tab";
import { Tabs } from "../../components/tabs/Tabs";
import { ColorMode } from "./ColorMode";
import { ColorPaneSectionSettings } from "./ColorPaneSectionSettings";

export const ColorRoute = () => {
  const color = useLoaderData() as ButteryConfigTokens["color"];
  console.log({ color });
  return (
    <>
      <LayoutMainPaneLeft>
        <Tabs btInitActiveTab="settings">
          <Tab btId="settings" btLabel="Settings">
            <ColorPaneSectionSettings color={color} />
          </Tab>
          <Tab btId="graph" btLabel="Graph">
            <LayoutMainPaneSection
              btTitle="graph"
              btSubtitle="The graphical representation of the configuration that has been configured in the left pane."
            >
              {/* <ColorJSON /> */}
            </LayoutMainPaneSection>
          </Tab>
          <Tab btId="other" btLabel="other">
            Other tab - WIP
          </Tab>
        </Tabs>
        <ColorMode />
      </LayoutMainPaneLeft>
      <LayoutMainContent>{/* <ColorPalette /> */}</LayoutMainContent>
    </>
  );
};
