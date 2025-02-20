import { classes } from "@buttery/components";
import type { JSX } from "react";
import { forwardRef } from "react";

export type LayoutConfigSectionControlsContentPropsNative =
  JSX.IntrinsicElements["div"];
export type LayoutConfigSectionControlsContentProps =
  LayoutConfigSectionControlsContentPropsNative;

export const LayoutConfigSectionControlsContent = forwardRef<
  HTMLDivElement,
  LayoutConfigSectionControlsContentProps
>(function LayoutConfigSectionControlsContent(
  { children, className, ...restProps },
  ref
) {
  return (
    <div {...restProps} className={classes(className)} ref={ref}>
      {children}
    </div>
  );
});
