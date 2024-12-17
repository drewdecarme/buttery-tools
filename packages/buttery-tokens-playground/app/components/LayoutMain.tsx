import type { JSX } from "react";
import { forwardRef } from "react";
import { css } from "@linaria/core";
import { makeCustom } from "@buttery/tokens/playground";
import { classes } from "@buttery/components";

export type LayoutMainPropsNative = JSX.IntrinsicElements["main"];
export type LayoutMainProps = LayoutMainPropsNative;

const styles = css`
  max-width: ${makeCustom("layout-max-width")};
  margin: 0 auto;
`;

export const LayoutMain = forwardRef<HTMLElement, LayoutMainProps>(
  function LayoutMain({ children, className, ...restProps }, ref) {
    return (
      <main {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </main>
    );
  }
);
