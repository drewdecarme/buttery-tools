import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type LayoutConfigSectionPropsNative = JSX.IntrinsicElements["section"];
export type LayoutConfigSectionProps = LayoutConfigSectionPropsNative;

const styles = css`
  display: grid;
  grid-template-columns: 1fr 60%;
  gap: ${makeRem(32)};
  margin-top: ${makeRem(32)};
`;

export const LayoutConfigSection = forwardRef<
  HTMLElement,
  LayoutConfigSectionProps
>(function LayoutConfigSection({ children, className, ...restProps }, ref) {
  return (
    <section {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </section>
  );
});
