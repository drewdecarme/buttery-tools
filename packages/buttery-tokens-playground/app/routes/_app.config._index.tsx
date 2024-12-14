import { ColorPreviewBrand } from "~/components/ColorPreviewBrand";
import { ColorBrandMode } from "~/components/ColorBrandMode";
import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";

export default function ColorsRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Brand Colors"
          dxDescription={
            <>
              Brand colors are an essential part of your application&apos;s
              design system, providing consistency and harmony across all visual
              assets.
            </>
          }
        >
          <ColorBrandMode />
        </LayoutConfigSectionControls>
        <LayoutConfigSectionPreview>
          <ColorPreviewBrand />
        </LayoutConfigSectionPreview>
      </LayoutConfigSection>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Neutral Colors"
          dxDescription={
            <>
              Brand colors are an essential part of your application&apos;s
              design system, providing consistency and harmony across all visual
              elements. This configuration allows you to generate a cohesive
              color palette using harmonious fluorescent tones by defining
              parameters for saturation, brightness, and hue variations.
            </>
          }
        >
          neutral confic
        </LayoutConfigSectionControls>
        <LayoutConfigSectionPreview>neutral preview</LayoutConfigSectionPreview>
      </LayoutConfigSection>
    </>
  );
}
