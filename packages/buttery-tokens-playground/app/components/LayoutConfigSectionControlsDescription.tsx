import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type LayoutConfigSectionControlsDescriptionPropsNative =
  JSX.IntrinsicElements["p"];
export type LayoutConfigSectionControlsDescriptionProps =
  LayoutConfigSectionControlsDescriptionPropsNative;

const styles = css`
  font-size: ${makeRem(14)};
  width: 40ch;
`;

export const LayoutConfigSectionControlsDescription = forwardRef<
  HTMLParagraphElement,
  LayoutConfigSectionControlsDescriptionProps
>(function LayoutConfigSectionControlsDescription(
  { children, className, ...restProps },
  ref
) {
  return (
    <p {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </p>
  );
});
