import { classes } from "@buttery/components";
import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type VariantContainerPropsNative = JSX.IntrinsicElements["div"];
export type VariantContainerProps = VariantContainerPropsNative;

const styles = css`
  background: white;
  padding: ${makeRem(16)};
  width: 100%;
  border: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
  border-radius: ${makeRem(4)};
`;

export const VariantContainer = forwardRef<
  HTMLDivElement,
  VariantContainerProps
>(function VariantContainer({ children, className, ...restProps }, ref) {
  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </div>
  );
});
