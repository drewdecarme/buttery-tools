import { classes } from "@buttery/components";
import type {
  ButteryTokensColorVariant,
  ButteryTokensColorVariantBase,
  ColorVariantTypes,
} from "@buttery/tokens-utils/schemas";
import { css } from "@linaria/core";
import type { ChangeEventHandler, JSX } from "react";
import { useMemo, forwardRef, useId } from "react";
import { match } from "ts-pattern";
import { makeColor, makeRem } from "@buttery/tokens/playground";

import { ColorSwatchVariantTypeAuto } from "./ColorSwatchVariantTypeAuto";
import type { ColorSwatchVariantTypeNamedProps } from "./ColorSwatchVariantTypeNamed";
import { ColorSwatchVariantTypeNamed } from "./ColorSwatchVariantTypeNamed";
import type { ColorSwatchVariantTypeManualProps } from "./ColorSwatchVariantTypeManual";
import { ColorSwatchVariantTypeManual } from "./ColorSwatchVariantTypeManual";

import { InputLabel } from "../components/InputLabel";
import { InputSelect } from "../components/InputSelect";

export type ColorSwatchVariantsPropsNative = JSX.IntrinsicElements["div"];
export type ColorSwatchVariantsPropsCustom = {
  dxVariants: ButteryTokensColorVariant;
  onChangeVariantType: ChangeEventHandler<HTMLSelectElement>;
  onChangeVariantAuto: <T extends ButteryTokensColorVariantBase>(
    variant: T
  ) => void;
  onChangeVariantNamed: ColorSwatchVariantTypeNamedProps["onChangeVariantNamed"];
  onChangeVariantManual: ColorSwatchVariantTypeManualProps["onChangeVariantManual"];
};
export type ColorSwatchVariantsProps = ColorSwatchVariantsPropsNative &
  ColorSwatchVariantsPropsCustom;

const styles = css`
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: ${makeRem(16)};

  & > * {
    &:last-child {
      padding-left: ${makeRem(16)};
      border-left: ${makeRem(1)} solid
        ${makeColor("neutral-light", {
          opacity: 0.05,
        })};
    }
  }
`;

const variantOptions: {
  type: ColorVariantTypes["type"];
  display: string;
  description: string;
}[] = [
  {
    type: "auto",
    display: "Auto",
    description:
      "Variants are created automatically based upon the number of variants you want",
  },
  {
    type: "auto-named",
    display: "Named",
    description:
      "Variants are created automatically however the number of names you provide is the number of variants that are created.",
  },
  {
    type: "key-value",
    display: "Manual",
    description:
      "Create your variants automatically by providing a HEX and an associative name",
  },
];

export const ColorSwatchVariants = forwardRef<
  HTMLDivElement,
  ColorSwatchVariantsProps
>(function ColorSwatchVariants(
  {
    children,
    className,
    dxVariants,
    onChangeVariantType,
    onChangeVariantAuto,
    onChangeVariantNamed,
    onChangeVariantManual,
    ...restProps
  },
  ref
) {
  const variantModeId = useId();
  const variantUnion = useMemo<ColorVariantTypes>(() => {
    if (typeof dxVariants === "number") {
      return {
        type: "auto",
        variant: dxVariants,
      };
    }
    if (Array.isArray(dxVariants)) {
      return {
        type: "auto-named",
        variant: dxVariants,
      };
    }
    return {
      type: "key-value",
      variant: dxVariants,
    };
  }, [dxVariants]);

  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      {useMemo(
        () => (
          <div>
            <InputLabel
              dxLabel="Variant mode"
              dxSize="dense"
              htmlFor={variantModeId}
            />
            <InputSelect
              dxSize="dense"
              value={variantUnion.type}
              onChange={onChangeVariantType}
              id={variantModeId}
              style={{ width: "100%" }}
            >
              {variantOptions.map((option) => (
                <option value={option.type} key={option.type}>
                  {option.display}
                </option>
              ))}
            </InputSelect>
          </div>
        ),
        [onChangeVariantType, variantModeId, variantUnion.type]
      )}
      <div>
        {match(variantUnion)
          .with({ type: "auto" }, ({ variant }) => (
            <ColorSwatchVariantTypeAuto
              variant={variant}
              onChangeVariantAuto={onChangeVariantAuto}
            />
          ))
          .with({ type: "auto-named" }, ({ variant }) => {
            return (
              <ColorSwatchVariantTypeNamed
                variants={variant}
                onChangeVariantNamed={onChangeVariantNamed}
              />
            );
          })
          .with({ type: "key-value" }, ({ variant }) => {
            return (
              <ColorSwatchVariantTypeManual
                variants={variant}
                onChangeVariantManual={onChangeVariantManual}
              />
            );
          })
          .exhaustive()}
      </div>
    </div>
  );
});
