import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { BreakpointConfig } from "~/features/BreakpointConfig";
import { BreakpointPreview } from "~/features/BreakpointPreview";
import { BreakpointPreviewContent } from "~/features/BreakpointPreviewContent";

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
