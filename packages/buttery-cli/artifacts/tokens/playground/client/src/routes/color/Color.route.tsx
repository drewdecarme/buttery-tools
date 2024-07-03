import type { ButteryConfigTokens } from "@buttery/core";
import { type FormEventHandler, useCallback, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { apiClient } from "../../api";
import { LayoutMainContent } from "../../components/layout/LayoutMainContent";
import { LayoutMainPaneLeft } from "../../components/layout/LayoutMainPaneLeft";
import { LayoutMainPaneSection } from "../../components/layout/LayoutMainPaneSection";
import { Tab } from "../../components/tabs/Tab";
import { Tabs } from "../../components/tabs/Tabs";
import { ColorMode } from "./ColorMode";
import { ColorPaneSectionSettings } from "./ColorPaneSectionSettings";

export const ColorRoute = () => {
  const config = useLoaderData() as ButteryConfigTokens;
  const fetcher = useFetcher();
  console.log({ config });

  const [liveConfig, setLiveConfig] = useState(config);

  const handleSubmit = useCallback<
    FormEventHandler<HTMLFormElement>
  >(async () => {
    await apiClient.config.saveConfig(liveConfig);
  }, [liveConfig]);

  return (
    <>
      <LayoutMainPaneLeft>
        <Tabs btInitActiveTab="settings">
          <Tab btId="settings" btLabel="Settings">
            <ColorPaneSectionSettings color={liveConfig.color} />
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
      <LayoutMainContent>
        <fetcher.Form onSubmit={handleSubmit}>
          <button type="submit">save</button>
        </fetcher.Form>
      </LayoutMainContent>
    </>
  );
};
