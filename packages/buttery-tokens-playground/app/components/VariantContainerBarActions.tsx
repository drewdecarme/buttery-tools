import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type VariantContainerBarActionsPropsNative =
  JSX.IntrinsicElements["div"];
export type VariantContainerBarActionsProps =
  VariantContainerBarActionsPropsNative;

const styles = css`
  display: flex;
  gap: ${makeRem(4)};
  justify-content: flex-end;
  align-items: center;
`;

export const VariantContainerBarActions = forwardRef<
  HTMLDivElement,
  VariantContainerBarActionsProps
>(function VariantContainerBarActions(
  { children, className, ...restProps },
  ref
) {
  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </div>
  );
});
