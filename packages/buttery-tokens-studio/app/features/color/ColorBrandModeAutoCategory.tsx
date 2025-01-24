import type { Updater } from "use-immer";
import type { ChangeEventHandler } from "react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { ButteryTokensColorBrandTypeAuto } from "@buttery/tokens-utils/schemas";
import {
  ColorBrandTypeJewelSchema,
  ColorBrandTypePastelSchema,
  ColorBrandTypeEarthSchema,
  ColorBrandTypeNeutralSchema,
  ColorBrandTypeFluorescentSchema,
} from "@buttery/tokens-utils/schemas";
import { makeRem, makeColor, makeFontWeight } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { classes, exhaustiveMatchGuard } from "@buttery/components";
import { hexToHsb } from "@buttery/tokens-utils";
import { match, P } from "ts-pattern";

import { InputColor } from "~/components/InputColor";
import { InputLabel } from "~/components/InputLabel";
import { Button } from "~/components/Button";
import { IconTick01 } from "~/icons/IconTick01";
import { IconTickDouble01 } from "~/icons/IconTickDouble01";

import {
  ColorBrandModeAutoCategorySelect,
  colorCategories,
} from "./ColorBrandModeAutoCategorySelect";

import type {
  ConfigurationStateColor,
  ConfigurationStateColorBrandAuto,
} from "../config.utils.color";

const categoryContainerStyles = css`
  padding: ${makeRem(16)};
  background: white;
  border: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};
  border-radius: ${makeRem(4)};

  .cat-head {
    margin-bottom: ${makeRem(16)};
    border-bottom: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};
    padding-bottom: ${makeRem(16)};

    .title {
      display: grid;
      grid-template-columns: ${makeRem(24)} 1fr;
      align-items: center;
      gap: ${makeRem(8)};
      font-weight: ${makeFontWeight("Mulish-bold")};
    }

    .desc {
      font-size: ${makeRem(12)};
      font-weight: ${makeFontWeight("Mulish-regular")};
      height: ${makeRem(44)};
      margin-top: ${makeRem(8)};
      line-height: 1.4;
    }
  }

  .cat-pick {
    display: grid;
    grid-template-columns: 1fr 2fr;
    margin-bottom: ${makeRem(16)};
    & > *:last-child {
      flex: 1;
      border-left: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};
      padding-left: ${makeRem(16)};
      margin-left: ${makeRem(16)};
    }

    .color {
      display: flex;
      gap: ${makeRem(16)};
      align-items: center;
      height: ${makeRem(24)};

      .match {
        font-size: ${makeRem(14)};
        display: flex;
        gap: ${makeRem(8)};
        align-items: center;
      }
    }

    button {
      &.close {
        color: ${makeColor("primary-700")};
      }
      &.exact {
        color: ${makeColor("success-600")};
      }
    }
  }
`;

const schemas = [
  ColorBrandTypeJewelSchema,
  ColorBrandTypePastelSchema,
  ColorBrandTypeEarthSchema,
  ColorBrandTypeNeutralSchema,
  ColorBrandTypeFluorescentSchema,
];

export type ColorBrandModeAutoCategoryProps = {
  setColor: Updater<ConfigurationStateColor>;
  state: ConfigurationStateColorBrandAuto;
};

export function ColorBrandModeAutoCategory({
  setColor,
  state,
}: ColorBrandModeAutoCategoryProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [matchType, setMatchType] = useState<
    | {
        category: ButteryTokensColorBrandTypeAuto["type"];
        matchType: "exact" | "close";
      }
    | undefined
  >(undefined);
  const handleSelectCategory = useCallback<
    (type: ButteryTokensColorBrandTypeAuto["type"]) => void
  >(
    (value) => {
      const category = value as ButteryTokensColorBrandTypeAuto["type"];
      setColor((draft) => {
        draft.brand.auto.type = category;
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
  const handlePickColorForCategory = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ target: { value } }) => {
      function matchColorToSchemas() {
        const { s, b } = hexToHsb(value);

        const exactMatch = schemas.find((schema) => {
          const saturationOptions = schema.shape.saturation._def.options.map(
            (opt) => opt.value
          );
          const brightnessOptions = schema.shape.brightness._def.options.map(
            (opt) => opt.value
          );

          // Check if both saturation and brightness match exactly
          // @ts-expect-error The s and b don't match up to the literals but they are
          // numbers so we can safely ignore this TS error
          return saturationOptions.includes(s) && brightnessOptions.includes(b);
        });

        if (exactMatch) {
          setMatchType({
            category: exactMatch.shape.type._def.value,
            matchType: "exact",
          });
          handleSelectCategory(exactMatch.shape.type._def.value);
          return;
        }

        const calculateDistance = (schema: (typeof schemas)[0]) => {
          const saturationOptions = schema.shape.saturation._def.options;
          const brightnessOptions = schema.shape.brightness._def.options;

          // Closest saturation and brightness values
          const closestSaturation = Math.min(
            ...saturationOptions.map((opt) => Math.abs(opt.value - s))
          );
          const closestBrightness = Math.min(
            ...brightnessOptions.map((opt) => Math.abs(opt.value - b))
          );

          // Use Hue only if it's part of schema matching
          const hueDistance = 0; // Add hue distance logic if needed

          // Total distance
          return closestSaturation + closestBrightness + hueDistance;
        };

        // Find the schema with the smallest distance
        const closestSchema = schemas.reduce<{
          schema: (typeof schemas)[0] | null;
          distance: number;
        }>(
          (accum, schema) => {
            const distance = calculateDistance(schema);
            if (distance < accum.distance) {
              return { schema, distance };
            }
            return accum;
          },
          { schema: null, distance: Infinity }
        );
        if (!closestSchema.schema) return;

        setMatchType({
          category: closestSchema.schema.shape.type._def.value,
          matchType: "close",
        });
        handleSelectCategory(closestSchema.schema.shape.type._def.value);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(matchColorToSchemas, 500);
    },
    [handleSelectCategory]
  );

  const CategoryIcon = colorCategories[state.type].Icon;
  const selectId = useId();

  return (
    <div className={categoryContainerStyles}>
      {useMemo(
        () => (
          <div className="cat-head">
            <div className="title">
              <CategoryIcon dxSize={24} />
              <span>{colorCategories[state.type].display}</span>
            </div>
            <div className="desc">
              {colorCategories[state.type].description}
            </div>
          </div>
        ),
        [CategoryIcon, state.type]
      )}
      <div className="cat-pick">
        {useMemo(
          () => (
            <InputLabel dxLabel="Manually select" dxSize="dense">
              <ColorBrandModeAutoCategorySelect
                id={selectId}
                onSelect={handleSelectCategory}
                selectedType={state.type}
              />
            </InputLabel>
          ),
          [handleSelectCategory, selectId, state.type]
        )}
        <InputLabel dxLabel="Pick a color" dxSize="dense">
          <div className="color">
            <InputColor dxSize="dense" onChange={handlePickColorForCategory} />
            <div className={classes("match", matchType?.matchType)}>
              {match(matchType)
                .with(P.nullish, () => null)
                .with({ matchType: "close" }, () => (
                  <Button
                    dxVariant="icon"
                    className="close"
                    dxHelp="Close Match: This color profile doesn't not explicitly match the constraints of the category. However this color represent's it's nearest match"
                    DXIcon={IconTick01}
                  />
                ))
                .with({ matchType: "exact" }, (state) => (
                  <Button
                    dxVariant="icon"
                    className="exact"
                    dxHelp={`Exact Match: This color's hue, saturation, and brightness matches the exact profile of "${state.category}" category.`}
                    DXIcon={IconTickDouble01}
                  />
                ))
                .exhaustive()}
              {matchType && (
                <div>{colorCategories[matchType.category].display}</div>
              )}
            </div>
          </div>
        </InputLabel>
      </div>
    </div>
  );
}
