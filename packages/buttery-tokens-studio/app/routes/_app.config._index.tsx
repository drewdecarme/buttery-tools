import type { MetaFunction } from "react-router";

import { ColorPreviewBrand } from "~/features/color/ColorPreviewBrand";
import { ColorBrandMode } from "~/features/color/ColorBrandMode";
import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { ColorPreviewNeutral } from "~/features/color/ColorPreviewNeutral";
import { ColorNeutral } from "~/features/color/ColorNeutral";
import { ColorPreview } from "~/features/color/ColorPreview";

export const meta: MetaFunction = () => {
  return [
    { title: "Color | Tokens Studio" },
    {
      name: "description",
      content:
        "Select a methodology in which to create the colors in your palette. Add variants, neutral tones, and static colors to round your palette out.",
    },
  ];
};

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
        <ColorPreview>
          <ColorPreviewBrand />
        </ColorPreview>
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
          <ColorNeutral />
        </LayoutConfigSectionControls>
        <ColorPreview>
          <ColorPreviewNeutral />
        </ColorPreview>
      </LayoutConfigSection>
    </>
  );
}
