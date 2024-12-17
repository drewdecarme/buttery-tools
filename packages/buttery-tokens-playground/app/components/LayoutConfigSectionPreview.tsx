import { classes } from "@buttery/components";
import { makeCustom } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type LayoutConfigSectionPreviewPropsNative =
  JSX.IntrinsicElements["div"];
export type LayoutConfigSectionPreviewProps =
  LayoutConfigSectionPreviewPropsNative;

const styles = css`
  padding-top: ${makeCustom("layout-section-offset-top")};
  & > * {
    position: sticky;
    top: calc(158px + 32px);
  }
`;

export const LayoutConfigSectionPreview = forwardRef<
  HTMLDivElement,
  LayoutConfigSectionPreviewProps
>(function LayoutConfigSectionPreview(
  { children, className, ...restProps },
  ref
) {
  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      <div>{children}</div>
    </div>
  );
});
