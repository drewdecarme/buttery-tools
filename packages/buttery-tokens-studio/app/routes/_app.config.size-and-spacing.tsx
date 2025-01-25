import type { MetaFunction } from "react-router";

import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { SizeConfig } from "~/features/size-and-space/SizeConfig";
import { SizePreview } from "~/features/size-and-space/SizePreview";
import { SizePreviewContent } from "~/features/size-and-space/SizePreviewContent";
import { SpaceConfig } from "~/features/size-and-space/SpaceConfig";
import { SpacePreview } from "~/features/size-and-space/SpacePreview";
import { SpacePreviewContent } from "~/features/size-and-space/SpacePreviewContent";

export const meta: MetaFunction = () => {
  return [
    { title: "Size & Spacing | Tokens Studio" },
    {
      name: "description",
      content:
        "Configure specific tokens to manage vertical rhythm, relative size and factor based spacing",
    },
  ];
};

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
