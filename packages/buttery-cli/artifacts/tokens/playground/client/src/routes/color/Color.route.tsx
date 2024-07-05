import { LayoutPaneSection } from "../../components/layout/LayoutPaneSection";
import { LayoutPaneTitle } from "../../components/layout/LayoutPaneTitle";
import { Tab } from "../../components/tabs/Tab";
import { Tabs } from "../../components/tabs/Tabs";
import { ColorPaneSectionSettings } from "./ColorPaneSectionSettings";

export const ColorRoute = () => {
  return (
    <>
      <LayoutPaneTitle>Palette</LayoutPaneTitle>
      <Tabs btInitActiveTab="settings" onSurface>
        <Tab btId="settings" btLabel="Settings">
          <ColorPaneSectionSettings />
        </Tab>
        <Tab btId="graph" btLabel="Graph">
          <LayoutPaneSection
            btTitle="graph"
            btSubtitle="The graphical representation of the configuration that has been configured in the left pane."
          >
            {/* <ColorJSON /> */}
          </LayoutPaneSection>
        </Tab>
        <Tab btId="other" btLabel="other">
          Other tab - WIP
        </Tab>
      </Tabs>
    </>
  );
};
