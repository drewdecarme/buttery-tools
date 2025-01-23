import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { SizeConfig } from "~/features/size-and-space/SizeConfig";
import { SizePreview } from "~/features/size-and-space/SizePreview";
import { SizePreviewContent } from "~/features/size-and-space/SizePreviewContent";
import { SpaceConfig } from "~/features/size-and-space/SpaceConfig";
import { SpacePreview } from "~/features/size-and-space/SpacePreview";
import { SpacePreviewContent } from "~/features/size-and-space/SpacePreviewContent";

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
