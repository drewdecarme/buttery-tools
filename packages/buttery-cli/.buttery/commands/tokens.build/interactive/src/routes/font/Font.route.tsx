import { LayoutMainContent } from "../../components/layout/LayoutMainContent";
import { LayoutMainPaneLeft } from "../../components/layout/LayoutMainPaneLeft";
import { LayoutMainPaneRight } from "../../components/layout/LayoutMainPaneRight";
import { LayoutMainPaneSection } from "../../components/layout/LayoutMainPaneSection";
import { FontProvider } from "./Font.context";

export const FontRoute = () => {
  return (
    <FontProvider>
      <LayoutMainPaneLeft>
        <LayoutMainPaneSection btTitle="WIP">WIP</LayoutMainPaneSection>
      </LayoutMainPaneLeft>
      <LayoutMainContent>
        <div>WIP</div>
      </LayoutMainContent>
      <LayoutMainPaneRight>
        <LayoutMainPaneSection>tabs</LayoutMainPaneSection>
        <LayoutMainPaneSection
          btTitle="graph"
          btSubtitle="The graphical representation of the configuration that has been configured in the left pane."
        >
          WIP
        </LayoutMainPaneSection>
      </LayoutMainPaneRight>
    </FontProvider>
  );
};
