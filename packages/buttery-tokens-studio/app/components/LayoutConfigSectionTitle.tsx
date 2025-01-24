import { classes } from "@buttery/components";
import { makeRem, makeCustom } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type LayoutConfigSectionTitlePropsNative = JSX.IntrinsicElements["div"];
export type LayoutConfigSectionTitleProps = LayoutConfigSectionTitlePropsNative;

const styles = css`
  display: flex;
  align-items: center;
  top: ${makeRem(133)};
  position: sticky;
  background: inherit;
  height: ${makeCustom("layout-section-title-height")};
  z-index: 10;
`;

export const LayoutConfigSectionTitle = forwardRef<
  HTMLDivElement,
  LayoutConfigSectionTitleProps
>(function LayoutConfigSectionTitle(
  { children, className, ...restProps },
  ref
) {
  return (
    <div
      {...restProps}
      className={classes(styles, className, "title")}
      ref={ref}
    >
      {children}
    </div>
  );
});
