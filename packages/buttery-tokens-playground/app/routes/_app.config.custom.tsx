import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { CustomPreview } from "~/features/custom/CustomPreview";
import { CustomPreviewContent } from "~/features/custom/CustomPreviewContent";

export default function ConfigResponseRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Custom"
          dxDescription={<>explanation of breakpoints</>}
        >
          custom
        </LayoutConfigSectionControls>
        <CustomPreview>
          <CustomPreviewContent />
        </CustomPreview>
      </LayoutConfigSection>
    </>
  );
}
