import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { FontFamilyConfig } from "~/features/font/FontFamilyConfig";
import { FontFamilyPreview } from "~/features/font/FontFamilyPreview";
import { FontFamilyPreviewContent } from "~/features/font/FontFamilyPreviewContent";
import { FontVariantConfig } from "~/features/font/FontVariantConfig";
import { FontVariantPreview } from "~/features/font/FontVariantPreview";
import { FontVariantPreviewContent } from "~/features/font/FontVariantPreviewContent";

export default function ConfigTypographyRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Families"
          dxDescription={
            <>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque
              odit a corporis harum consequatur reprehenderit repellendus
              impedit possimus, ea deleniti nostrum velit officia nihil quidem
              aut dicta dolorum officiis in!
            </>
          }
        >
          <FontFamilyConfig />
        </LayoutConfigSectionControls>
        <FontFamilyPreview>
          <FontFamilyPreviewContent />
        </FontFamilyPreview>
      </LayoutConfigSection>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Typography variants"
          dxDescription={
            <>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque
              odit a corporis harum consequatur reprehenderit repellendus
              impedit possimus, ea deleniti nostrum velit officia nihil quidem
              aut dicta dolorum officiis in!
            </>
          }
        >
          <FontVariantConfig />
        </LayoutConfigSectionControls>
        <FontVariantPreview>
          <FontVariantPreviewContent />
        </FontVariantPreview>
      </LayoutConfigSection>
    </>
  );
}
