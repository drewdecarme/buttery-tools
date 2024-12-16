import type { ButteryTokensColorBrandTypeAuto } from "@buttery/tokens-utils/schemas";
import { css } from "@linaria/core";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { useCallback } from "react";
import { classes } from "@buttery/components";

import { IconBrush } from "~/icons/IconBrush";
import { IconColors } from "~/icons/IconColors";
import type { IconCopy } from "~/icons/IconCopy";
import { IconEarth } from "~/icons/IconEarth";
import { IconGem } from "~/icons/IconGem";
import { IconIdea01 } from "~/icons/IconIdea01";

import { InputSelectDropdown } from "./InputSelectDropdown";
import { useInputSelectDropdownContext } from "./InputSelectDropdown.context";

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
`;

const itemStyles = css`
  ${makeReset("button")};
  text-align: left;
  width: ${makeRem(400)};
  display: grid;
  grid-template-columns: ${makeRem(24)} 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "icon title"
    "icon description";
  column-gap: ${makeRem(8)};
  font-size: ${makeRem(12)};
  transition: all 0.1s ease-in-out;
  min-height: ${makeRem(52)};
  align-content: center;
  padding: ${makeRem(12)} ${makeRem(16)};

  &:first-child {
    border-top-right-radius: inherit;
    border-top-left-radius: inherit;
  }
  &:last-child {
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  &.active {
    background: ${makeColor("primary", { opacity: 0.2 })};
  }

  .icon {
    grid-area: icon;
    display: grid;
    height: 100%;
    width: 100%;
    place-content: center;
  }
  .title {
    grid-area: title;
    margin-bottom: ${makeRem(4)};
    font-weight: ${makeFontWeight("semi-bold")};
  }
  .description {
    grid-area: description;
    color: ${makeColor("neutral-light", { opacity: 0.7 })};
    font-size: ${makeRem(11)};
  }
`;

function CategoryItem({
  Icon,
  display,
  description,
  isSelected,
  type,
}: (typeof colorCategories)[0] & {
  isSelected: boolean;
}) {
  const { onSelect: onDropdownSelect } = useInputSelectDropdownContext();

  return (
    <button
      className={classes(itemStyles, { active: isSelected })}
      onClick={() => onDropdownSelect(type)}
    >
      <div className="icon">
        <Icon dxSize={16} />
      </div>
      <div className="title">{display}</div>
      <div className="description">{description}</div>
    </button>
  );
}

export function ColorBrandModeAutoCategory<T extends string>(props: {
  onSelect: (value: T) => void;
  id: string;
  selectedType: ButteryTokensColorBrandTypeAuto["type"];
}) {
  const handleSelect = useCallback<(value: string) => void>(
    (value) => {
      // @ts-expect-error This is a string here
      props.onSelect(value);
    },
    [props]
  );

  return (
    <InputSelectDropdown
      dxOnSelect={handleSelect}
      id={props.id}
      defaultValue={props.selectedType}
      dxOffset={4}
    >
      <ul className={styles}>
        {colorCategories.map((category) => {
          return (
            <li key={category.type}>
              <CategoryItem
                isSelected={props.selectedType === category.type}
                {...category}
              />
            </li>
          );
        })}
      </ul>
    </InputSelectDropdown>
  );
}
