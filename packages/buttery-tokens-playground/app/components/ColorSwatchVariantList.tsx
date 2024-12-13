import { classes } from "@buttery/components";
import { makeReset, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type ColorSwatchVariantListPropsNative = JSX.IntrinsicElements["ul"];
export type ColorSwatchVariantListProps = ColorSwatchVariantListPropsNative;

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(4)};

  li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: ${makeRem(8)};
    align-items: center;
    height: ${makeRem(24)};
  }
`;

export const ColorSwatchVariantList = forwardRef<
  HTMLUListElement,
  ColorSwatchVariantListProps
>(function ColorSwatchVariantList({ children, className, ...restProps }, ref) {
  return (
    <ul {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </ul>
  );
});
