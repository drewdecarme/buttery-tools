import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import type { ButteryTokensColorBrandTypeAuto } from "@buttery/tokens-utils/schemas";
import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";

import type { IconCopy } from "~/icons/IconCopy";
import { IconEarth } from "~/icons/IconEarth";
import { IconGem } from "~/icons/IconGem";
import { IconIdea01 } from "~/icons/IconIdea01";
import { IconBrush } from "~/icons/IconBrush";
import { IconColors } from "~/icons/IconColors";

import type { ConfigurationContextType } from "./Config.context";
import type { ConfigurationStateColorBrandAuto } from "./config.utils";
import { InputLabel } from "./InputLabel";
import { InputRadio } from "./InputRadio";

const colorCategories: {
  type: ButteryTokensColorBrandTypeAuto["type"];
  display: string;
  description: string;
  Icon: typeof IconCopy;
}[] = [
  {
    type: "earth",
    display: "Earth",
    description:
      "These are colors commonly found in nature. They are influenced by the tones of trees, forest, seas and sky and are muted and flat to emulate natural colors.",
    Icon: IconEarth,
  },
  {
    type: "fluorescent",
    display: "Fluorescent",
    description:
      "Fluorescence is a result of photoluminescence. Phosphorescent color emits light when excited by visible or ultraviolet light. These colors are bright and vibrant.",
    Icon: IconIdea01,
  },
  {
    type: "jewel",
    display: "Jewel",
    description:
      "Richly saturated hues named for gems including sapphire blue, ruby red, amethyst purple, citrine yellow, and emerald green. These colors are regal, deep and impart a sense of luxury.",
    Icon: IconGem,
  },
  {
    type: "neutral",
    display: "Neutral",
    description:
      "Pure neutral colors include black, white, beige and all grays while near neutrals include browns, tans, and darker colors.",
    Icon: IconColors,
  },
  {
    type: "pastel",
    display: "Pastel",
    description:
      "Pastel colors belong to the pale family of colors. The colors of this family are usually described as 'soothing'",
    Icon: IconBrush,
  },
];

const styles = css`
  ${makeReset("ul")};

  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function ColorBrandModeAuto({
  state,
  setColor,
}: {
  state: ConfigurationStateColorBrandAuto;
  setColor: ConfigurationContextType["setColor"];
}) {
  const handleSelectCategory = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
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

  return (
    <>
      <InputLabel
        dxLabel="Select a color category"
        dxHelp="The color category determines the tone of the hues that you choose"
      />
      <ul className={styles}>
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
        {/* {Object.entries(state).map(([colorId, colorNameAndDef]) => {
          return (
            <li key={colorId}>
              <ColorBrandModeAutoSwatch
                colorDef={{ [colorId]: colorNameAndDef }}
                setColor={setColor}
              />
            </li>
          );
        })} */}
        {/* <li>
          <ColorSwatchAdd
            onClick={() =>
              setColor((draft) => {
                const id = generateGUID();
                draft.brand.manual[id] = {
                  hex: "#000000",
                  name: `brand${Object.entries(state).length + 1}`,
                  variants: 10,
                };
              })
            }
          />
        </li> */}
      </ul>
    </>
  );
}
