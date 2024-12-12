import { forwardRef } from "react";
import { css } from "@linaria/core";
import { classes } from "@buttery/components";
import { makeColor, makeRem } from "@buttery/tokens/playground";

export type ColorSwatchPropsNative = JSX.IntrinsicElements["div"];
export type ColorSwatchProps = ColorSwatchPropsNative;

const styles = css`
  padding: ${makeRem(8)};
  border: ${makeRem(1)} solid ${makeColor("neutral-light", { opacity: 0.2 })};
  border-radius: ${makeRem(4)};
`;

export const ColorSwatch = forwardRef<HTMLDivElement, ColorSwatchProps>(
  function ColorSwatch({ children, className, ...restProps }, ref) {
    return (
      <div {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </div>
    );
  }
);
