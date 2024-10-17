import { classes } from "@buttery/components";
import { makeColorBrand, makeColorShade, makeRem } from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type LayoutBodyBreadcrumbTextPropsNative = JSX.IntrinsicElements["div"];
export type LayoutBodyBreadcrumbTextPropsCustom = {
  dxIsActive?: boolean;
};
export type LayoutBodyBreadcrumbTextProps =
  LayoutBodyBreadcrumbTextPropsCustom & LayoutBodyBreadcrumbTextPropsNative;

const styles = css`
  color: ${makeColorShade("neutral")};
  font-size: ${makeRem(14)};

  position: relative;

  &:not(.active) {
    &:hover,
    &:focus {
      color: ${makeColorBrand("primary")};
      transition: all 0.15s ease-in-out;
    }
  }

  &.active {
    color: ${makeColorShade("neutral", { variant: "300" })};
  }
`;

export const LayoutBodyBreadcrumbText = forwardRef<
  HTMLDivElement,
  LayoutBodyBreadcrumbTextProps
>(function LayoutBodyBreadcrumbText(
  { children, className, dxIsActive = false, ...restProps },
  ref
) {
  return (
    <div
      {...restProps}
      className={classes(className, styles, { active: dxIsActive })}
      ref={ref}
    >
      {children}
    </div>
  );
});
