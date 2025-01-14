import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { FontFamilyConfig } from "~/features/FontFamilyConfig";
import { FontFamilyPreview } from "~/features/FontFamilyPreview";
import { FontFamilyPreviewContent } from "~/features/FontFamilyPreviewContent";
import { FontVariantConfig } from "~/features/FontVariantConfig";
import { FontVariantPreview } from "~/features/FontVariantPreview";
import { FontVariantPreviewContent } from "~/features/FontVariantPreviewContent";

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
