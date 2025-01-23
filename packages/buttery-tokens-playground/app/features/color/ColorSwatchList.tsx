import { classes } from "@buttery/components";
import { makeReset, makeRem, makeColor } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type ColorSwatchListPropsNative = JSX.IntrinsicElements["ul"];
export type ColorSwatchListProps = ColorSwatchListPropsNative;

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  border-radius: ${makeRem(4)};
  gap: ${makeRem(8)};

  & > li {
    width: 100%;
    border-radius: ${makeRem(4)};
    border: ${makeRem(1)} solid ${makeColor("neutral-light", { opacity: 0.1 })};
    /* & + li {
      border-top: ${makeRem(1)} solid
        ${makeColor("neutral-light", { opacity: 0.1 })};
    } */
    &:last-child {
      button {
        padding: ${makeRem(16)};
        background: ${makeColor("neutral-light", { opacity: 0.05 })};
        width: 100%;
      }
    }
  }
`;

export const ColorSwatchList = forwardRef<
  HTMLUListElement,
  ColorSwatchListProps
>(function ColorSwatchList({ children, className, ...restProps }, ref) {
  return (
    <ul {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </ul>
  );
});
