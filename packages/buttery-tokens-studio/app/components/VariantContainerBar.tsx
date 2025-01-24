import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type VariantContainerBarPropsNative = JSX.IntrinsicElements["div"];
export type VariantContainerBarProps = VariantContainerBarPropsNative;

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(100)} auto auto 1fr;
  gap: ${makeRem(16)};
  align-items: center;
`;

export const VariantContainerBar = forwardRef<
  HTMLDivElement,
  VariantContainerBarProps
>(function VariantContainerBar({ children, className, ...restProps }, ref) {
  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </div>
  );
});
