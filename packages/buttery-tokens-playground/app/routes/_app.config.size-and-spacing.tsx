import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { SizeConfig } from "~/features/SizeConfig";
import { SizePreview } from "~/features/SizePreview";
import { SizePreviewContent } from "~/features/SizePreviewContent";
import { SpaceConfig } from "~/features/SpaceConfig";
import { SpacePreview } from "~/features/SpacePreview";
import { SpacePreviewContent } from "~/features/SpacePreviewContent";

export default function ConfigSizeAndSpacingRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Sizing"
          dxDescription={<>explanation of sizing</>}
        >
          <SizeConfig />
        </LayoutConfigSectionControls>
        <SizePreview>
          <SizePreviewContent />
        </SizePreview>
      </LayoutConfigSection>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Spacing"
          dxDescription={<>explanation of spacing</>}
        >
          <SpaceConfig />
        </LayoutConfigSectionControls>
        <SpacePreview>
          <SpacePreviewContent />
        </SpacePreview>
      </LayoutConfigSection>
    </>
  );
}
