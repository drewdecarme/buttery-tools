import type { ButteryTokensColorPresets } from "@buttery/core";
import { makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { hsbToHex } from ".buttery/commands/tokens.build/utils/util.color-conversions";
import { createColorVariants } from ".buttery/commands/tokens.build/utils/util.create-color-variants";

import { match } from "ts-pattern";

const ColorContainer = styled("div")`
  display: flex;
  width: 100%;
  margin-bottom: ${makeRem(32)};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${makeRem(48)} ${makeRem(48)};
  grid-template-areas:
    "description"
    "main"
    "variants";
`;

const ColorMain = styled("div")`
  grid-area: main;
`;

const ColorVariants = styled("div")`
  grid-area: variants;
  display: flex;

  & > * {
    height: ${makeRem(48)};
    display: grid;
    place-content: center;
    flex: 1;
  }
`;

const ColorDescription = styled("div")`
  grid-area: description;
`;

export const ColorOutputPalettePresets: FC<ButteryTokensColorPresets> = ({
  saturation,
  brightness,
  application,
  neutral,
}) => {
  return (
    <>
      <h3>Application Colors</h3>
      <p style={{ maxWidth: "60ch" }}>
        These are the dynamic colors in your application. These colors can
        typically include colors that link the app to your brand, status colors
        such as success and error, as well as any neutral colors to illustrate
        color balance and depth.
      </p>
      {Object.entries(application.hues).map(([hue, hueValue]) => {
        const colorHex = hsbToHex(hueValue, saturation, brightness);

        return (
          <ColorContainer key={`color-${hue}`}>
            <ColorDescription>{hue}</ColorDescription>
            <ColorMain
              style={{
                backgroundColor: colorHex,
              }}
            />
            <ColorVariants>
              {match(application.variants)
                .with({ mode: "auto" }, (variantConfig) => {
                  const variants = createColorVariants(
                    colorHex,
                    variantConfig.total,
                    {
                      min: Number(application.variants.scaleMin),
                      max: Number(application.variants.scaleMax),
                    }
                  );
                  return variants.map(({ name, value }, i) => {
                    return (
                      <div
                        key={`color-${hue}-variant-${i.toString()}`}
                        style={{
                          gridArea: `v${i}`,
                          backgroundColor: value,
                        }}
                      >
                        {name}
                      </div>
                    );
                  });
                })
                // TODO: Build out the manual variants
                .with({ mode: "manual" }, (variantConfig) => {
                  return [];
                })
                .exhaustive()}
            </ColorVariants>
          </ColorContainer>
        );
      })}
      <ColorContainer>
        <ColorDescription>neutral</ColorDescription>
        <ColorMain
          style={{
            backgroundColor: neutral.base,
          }}
        />
        <ColorVariants>
          {match(neutral.variants)
            .with({ mode: "auto" }, (variantConfig) => {
              const variants = createColorVariants(
                neutral.base,
                variantConfig.total,
                {
                  // TODO: Add defaults config for min and max neutral scales
                  // so they can be referenced in multiple areas
                  min: Number(neutral.variants.scaleMin) || 10,
                  max: Number(neutral.variants.scaleMax),
                }
              );
              return variants.map((variant, i) => (
                <div
                  key={`color-neutral-variant-${i.toString()}`}
                  style={{
                    gridArea: `v${i}`,
                    backgroundColor: variant,
                  }}
                />
              ));
            })
            // TODO: Build out the manual variants
            .with({ mode: "manual" }, (variantConfig) => {
              return null;
            })
            .exhaustive()}
        </ColorVariants>
      </ColorContainer>
    </>
  );
};
