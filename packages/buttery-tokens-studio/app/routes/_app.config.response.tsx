import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { BreakpointConfig } from "~/features/breakpoint/BreakpointConfig";
import { BreakpointPreview } from "~/features/breakpoint/BreakpointPreview";
import { BreakpointPreviewContent } from "~/features/breakpoint/BreakpointPreviewContent";

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
