import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutTextOverlinePropsNative = JSX.IntrinsicElements["div"];
export type LayoutTextOverlineProps = LayoutTextOverlinePropsNative;

export const layoutNavOverlineCSS = css`
  ${makeReset("anchor")};
  font-size: ${makeRem(12)};
  text-transform: uppercase;
  font-weight: ${makeFontWeight("semi-bold")};
  color: ${makeColor("neutral", { variant: "300" })};
  letter-spacing: ${makeRem(1.4)};
`;

export const LayoutTextOverline = forwardRef<
  HTMLDivElement,
  LayoutTextOverlineProps
>(function LayoutTextOverline({ children, className, ...restProps }, ref) {
  return (
    <div
      {...restProps}
      className={clsx(layoutNavOverlineCSS, className)}
      ref={ref}
    >
      {children}
    </div>
  );
});
