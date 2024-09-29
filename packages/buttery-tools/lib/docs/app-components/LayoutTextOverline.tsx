import {
  makeColorShade,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { forwardRef } from "react";
import { classes } from "../../components/utils";

export type LayoutTextOverlinePropsNative = JSX.IntrinsicElements["div"];
export type LayoutTextOverlineProps = LayoutTextOverlinePropsNative;

export const layoutNavOverlineCSS = css`
  ${makeReset("anchor")};
  font-size: ${makeRem(12)};
  text-transform: uppercase;
  font-weight: ${makeFontWeight("bold")};
  color: ${makeColorShade("neutral", { variant: "900" })};
`;

export const LayoutTextOverline = forwardRef<
  HTMLDivElement,
  LayoutTextOverlineProps
>(function LayoutTextOverline({ children, className, ...restProps }, ref) {
  return (
    <div
      {...restProps}
      className={classes(layoutNavOverlineCSS, className)}
      ref={ref}
    >
      {children}
    </div>
  );
});
