import { classes } from "@buttery/components";
import type {
  ButteryTokensColorVariant,
  ColorVariantTypes,
} from "@buttery/tokens-utils/schemas";
import { css } from "@linaria/core";
import { useMemo, forwardRef } from "react";
import { match } from "ts-pattern";
import { makeColor, makeRem } from "@buttery/tokens/playground";

import { InputSelect } from "./InputSelect";
import { InputLabel } from "./InputLabel";
import { InputSection } from "./InputGroup";
import { InputNumber } from "./InputNumber";

export type ColorSwatchVariantsPropsNative = JSX.IntrinsicElements["div"];
export type ColorSwatchVariantsPropsCustom = {
  dxVariants: ButteryTokensColorVariant;
};
export type ColorSwatchVariantsProps = ColorSwatchVariantsPropsNative &
  ColorSwatchVariantsPropsCustom;

const styles = css`
  display: grid;
  grid-template-columns: 30% 1fr;

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
    display: "Auto Number",
    description:
      "Variants are created automatically based upon the number of variants you want",
  },
  {
    type: "auto-named",
    display: "Auto Named",
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
  { children, className, dxVariants, ...restProps },
  ref
) {
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
      <InputSection dxSize="dense">
        <InputLabel dxLabel="Variant mode" dxSize="dense">
          <InputSelect dxSize="dense" value={variantUnion.type}>
            {variantOptions.map((option) => (
              <option value={option.type} key={option.type}>
                {option.display}
              </option>
            ))}
          </InputSelect>
        </InputLabel>
      </InputSection>
      <InputSection>
        {match(variantUnion)
          .with({ type: "auto" }, ({ variant }) => {
            return (
              <InputLabel dxLabel="Total # of variants" dxSize="dense">
                <InputNumber dxSize="dense" value={variant} />
              </InputLabel>
            );
          })
          .otherwise(() => null)}
      </InputSection>
    </div>
  );
});
