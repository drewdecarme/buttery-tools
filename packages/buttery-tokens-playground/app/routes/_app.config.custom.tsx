import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { CustomConfig } from "~/features/custom/CustomConfig";
import { CustomPreview } from "~/features/custom/CustomPreview";
import { CustomPreviewContent } from "~/features/custom/CustomPreviewContent";

export default function ConfigResponseRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Custom"
          dxDescription={<>explanation of custom</>}
        >
          <CustomConfig />
        </LayoutConfigSectionControls>
        <CustomPreview>
          <CustomPreviewContent />
        </CustomPreview>
      </LayoutConfigSection>
    </>
  );
}
