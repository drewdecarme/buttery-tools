import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";
import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { generateGUID } from "@buttery/utils/isomorphic";

import type { ConfigurationContextType } from "./Config.context";
import { ColorSwatchAdd } from "./ColorSwatchAdd";
import { ColorSwatchList } from "./ColorSwatchList";
import { ColorBrandModeAutoSwatch } from "./ColorBrandModeAutoSwatch";
import type { ConfigurationStateColorBrandAuto } from "./config.utils.color";
import { colorAutoPresets } from "./config.utils.color";
import { ColorBrandModeAutoCategory } from "./ColorBrandModeAutoCategory";

import { InputRange } from "../components/InputRange";
import { InputSection } from "../components/InputSection";
import { InputLabel } from "../components/InputLabel";

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
  const handleChangeBrightness = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        // @ts-expect-error This number is validated by the min and max on the range
        draft.brand.auto.brightness = Number(value);
      });
    },
    [setColor]
  );

  const handleChangeSaturation = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        // @ts-expect-error This number is validated by the min and max on the range
        draft.brand.auto.saturation = Number(value);
      });
    },
    [setColor]
  );

  return (
    <>
      <InputSection>
        <InputLabel
          dxLabel="Determine the color category"
          dxHelp="Manually select a category or pick a color to auto determine it's category"
        />
        <ColorBrandModeAutoCategory state={state} setColor={setColor} />
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
            onChange={handleChangeSaturation}
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
            onChange={handleChangeBrightness}
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
                      name: `brand${Object.entries(state.colors).length + 1}`,
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
