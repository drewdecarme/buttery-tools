import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";
import type { ButteryTokensColorBrandTypeAuto } from "@buttery/tokens-utils/schemas";
import { useCallback, useId } from "react";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";

import type { ConfigurationContextType } from "./Config.context";
import {
  colorAutoPresets,
  type ConfigurationStateColorBrandAuto,
} from "./config.utils";
import { InputLabel } from "./InputLabel";
import { InputSection } from "./InputGroup";
import { ColorSwatchAdd } from "./ColorSwatchAdd";
import { ColorSwatchList } from "./ColorSwatchList";
import { InputRange } from "./InputRange";
import { ColorBrandModeAutoSwatch } from "./ColorBrandModeAutoSwatch";
import { ColorBrandModeAutoCategory } from "./ColorBrandModeAutoCategory";

const inputLabelStyles = css`
  margin-bottom: ${makeRem(16)};
  margin-top: ${makeRem(8)};
`;

export function ColorBrandModeAuto({
  state,
  setColor,
}: {
  state: ConfigurationStateColorBrandAuto;
  setColor: ConfigurationContextType["setColor"];
}) {
  const handleSelectCategory = useCallback<
    (type: ButteryTokensColorBrandTypeAuto["type"]) => void
  >(
    (value) => {
      const category = value as ButteryTokensColorBrandTypeAuto["type"];
      setColor((draft) => {
        draft.brand.auto.type = category;
        draft.brand.auto.colors = {
          [generateGUID()]: {
            name: "primary",
            hue: 40,
            variants: 10,
          },
          [generateGUID()]: {
            name: "secondary",
            hue: 180,
            variants: 4,
          },
        };

        switch (draft.brand.auto.type) {
          case "earth":
            draft.brand.auto.brightness = 36;
            draft.brand.auto.saturation = 36;
            break;

          case "fluorescent":
            draft.brand.auto.brightness = 82;
            draft.brand.auto.saturation = 63;
            break;

          case "jewel":
            draft.brand.auto.brightness = 56;
            draft.brand.auto.saturation = 73;
            break;

          case "neutral":
            draft.brand.auto.brightness = 58;
            draft.brand.auto.saturation = 1;
            break;

          case "pastel":
            draft.brand.auto.brightness = 89;
            draft.brand.auto.saturation = 14;
            break;

          default:
            exhaustiveMatchGuard(draft.brand.auto);
        }
      });
    },
    [setColor]
  );

  const selectId = useId();

  return (
    <>
      <InputSection>
        <InputLabel
          dxLabel="Select a color category"
          dxHelp="The color category determines the tone of the hues that you choose"
          htmlFor={selectId}
        />
        <ColorBrandModeAutoCategory
          id={selectId}
          onSelect={handleSelectCategory}
          selectedType={state.type}
        />

        {/* <ul className={styles}>
          {colorCategories.map((category) => {
            return (
              <li key={category.type}>
                <InputRadio
                  dxVariant="block"
                  name="type"
                  value={category.type}
                  checked={state.type === category.type}
                  dxTextPrimary={category.display}
                  dxTextSecondary={category.description}
                  DXIcon={category.Icon}
                  onChange={handleSelectCategory}
                />
              </li>
            );
          })}
        </ul> */}
      </InputSection>
      <InputSection>
        <InputLabel
          dxLabel="Configure your colors"
          dxHelp="Adjust the saturation, brightness and hues to get the colors you want in accordance with the selected category"
        />

        <div className={inputLabelStyles}>
          <InputLabel
            dxLabel="Saturation"
            htmlFor="saturation"
            dxSize="dense"
          />
          <InputRange
            id="saturation"
            dxDisplayMin
            dxDisplayMax
            dxDisplayInput
            {...colorAutoPresets[state.type].saturation}
            className={inputLabelStyles}
          />
        </div>
        <div className={inputLabelStyles}>
          <InputLabel
            dxLabel="Brightness"
            htmlFor="brightness"
            dxSize="dense"
          />
          <InputRange
            id="brightness"
            dxDisplayMin
            dxDisplayMax
            dxDisplayInput
            {...colorAutoPresets[state.type].brightness}
            className={inputLabelStyles}
          />
        </div>
        <div className={inputLabelStyles}>
          <InputLabel dxLabel="Hues & Variants" dxSize="dense" />
          <ColorSwatchList>
            {Object.entries(state.colors).map(([colorId, colorNameAndDef]) => {
              return (
                <li key={colorId}>
                  <ColorBrandModeAutoSwatch
                    colorDef={{ [colorId]: colorNameAndDef }}
                    setColor={setColor}
                  />
                </li>
              );
            })}
            <li>
              <ColorSwatchAdd
                onClick={() =>
                  setColor((draft) => {
                    const id = generateGUID();
                    draft.brand.auto.colors[id] = {
                      hue: 180,
                      name: `brand${Object.entries(state).length + 1}`,
                      variants: 10,
                    };
                  })
                }
              />
            </li>
          </ColorSwatchList>
        </div>
      </InputSection>
    </>
  );
}
