import type { MetaFunction } from "react-router";

import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { BreakpointConfig } from "~/features/breakpoint/BreakpointConfig";
import { BreakpointPreview } from "~/features/breakpoint/BreakpointPreview";
import { BreakpointPreviewContent } from "~/features/breakpoint/BreakpointPreviewContent";

export const meta: MetaFunction = () => {
  return [
    { title: "Response | Tokens Studio" },
    {
      name: "description",
      content:
        "Create breakpoint tokens that regulate how the application responds to different viewport sizes",
    },
  ];
};

export default function ConfigResponseRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Breakpoints"
          dxDescription={<>explanation of breakpoints</>}
        >
          <BreakpointConfig />
        </LayoutConfigSectionControls>
        <BreakpointPreview>
          <BreakpointPreviewContent />
        </BreakpointPreview>
      </LayoutConfigSection>
      {/* <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Containers"
          dxDescription={<>explanation of containers</>}
        >
          <ContainerConfig />
        </LayoutConfigSectionControls>
        <ContainerPreview>
          <ContainerPreviewContent />
        </ContainerPreview>
      </LayoutConfigSection> */}
    </>
  );
}
