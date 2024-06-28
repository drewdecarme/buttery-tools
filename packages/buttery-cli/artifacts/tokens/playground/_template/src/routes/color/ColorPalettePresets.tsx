import type { ButteryTokensColorPresets } from "@buttery/core";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { makeRem } from "#buttery/tokens/config-ui";

import { match } from "ts-pattern";
import { hsbToHex } from "../../../../../.buttery/commands/tokens/utils/util.color-conversions";
import { createColorVariants } from "../../../../../.buttery/commands/tokens/utils/util.create-color-variants";

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
    flex: 1;
  }
`;

const ColorDescription = styled("div")`
  grid-area: description;
`;

export const ColorPalettePresets: FC<ButteryTokensColorPresets> = ({
  saturation,
  brightness,
  application,
  neutral,
}) => {
  return (
    <>
      <h3>{"colors (from picker)"}</h3>
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
                  return variants.map((variant, i) => (
                    <div
                      key={`color-${hue}-variant-${i.toString()}`}
                      style={{
                        gridArea: `v${i}`,
                        backgroundColor: variant,
                      }}
                    />
                  ));
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
