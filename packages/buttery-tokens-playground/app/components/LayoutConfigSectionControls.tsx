import { classes } from "@buttery/components";
import { makeColor, makeFontWeight, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type LayoutConfigSectionControlsPropsNative =
  JSX.IntrinsicElements["article"];
export type LayoutConfigSectionControlsPropsCustom = {
  dxTitle: string;
};
export type LayoutConfigSectionControlsProps =
  LayoutConfigSectionControlsPropsNative &
    LayoutConfigSectionControlsPropsCustom;

const styles = css`
  padding-right: ${makeRem(32)};
  border-right: ${makeRem(1)} solid
    ${makeColor("neutral-light", { opacity: 0.2 })};

  h3 {
    font-size: ${makeRem(16)};
    font-weight: ${makeFontWeight("bold")};
  }
`;

export const LayoutConfigSectionControls = forwardRef<
  HTMLElement,
  LayoutConfigSectionControlsProps
>(function LayoutConfigSectionControls(
  { children, className, dxTitle, dxDescription, ...restProps },
  ref
) {
  return (
    <article {...restProps} className={classes(styles, className)} ref={ref}>
      <h3>{dxTitle}</h3>
      <p>{dxDescription}</p>
      {children}
    </article>
  );
});
