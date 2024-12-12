import { ConfigColorBrandMode } from "~/components/ConfigColorBrandMode";
import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";

export default function ConfigColorsRoute() {
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
          <ConfigColorBrandMode />
        </LayoutConfigSectionControls>
        <div style={{ height: 500, background: "green" }}></div>
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
      </LayoutConfigSection>
    </>
  );
}
