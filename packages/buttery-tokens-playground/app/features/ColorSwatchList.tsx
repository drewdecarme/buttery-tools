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
  border: ${makeRem(1)} solid ${makeColor("neutral-light", { opacity: 0.1 })};
  border-radius: ${makeRem(4)};

  & > li {
    width: 100%;
    & + li {
      border-top: ${makeRem(1)} solid
        ${makeColor("neutral-light", { opacity: 0.1 })};
    }
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
