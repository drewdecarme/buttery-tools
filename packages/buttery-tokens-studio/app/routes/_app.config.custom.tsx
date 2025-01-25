import type { MetaFunction } from "react-router";

import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { CustomConfig } from "~/features/custom/CustomConfig";
import { CustomPreview } from "~/features/custom/CustomPreview";
import { CustomPreviewContent } from "~/features/custom/CustomPreviewContent";

export const meta: MetaFunction = () => {
  return [
    { title: "Custom | Tokens Studio" },
    {
      name: "description",
      content:
        "Create custom tokens that can be used all across your application to share various styles and values",
    },
  ];
};

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
