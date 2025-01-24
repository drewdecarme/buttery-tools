import type { JSX } from "react";
import { forwardRef } from "react";
import { classes } from "@buttery/components";
import { css } from "@linaria/core";
import { makeColor, makeCustom, makeRem } from "@buttery/tokens/playground";

export type LayoutFooterPropsNative = JSX.IntrinsicElements["footer"];
export type LayoutFooterProps = LayoutFooterPropsNative;

const styles = css`
  height: ${makeRem(400)};
  padding: ${makeCustom("layout-gutters")};
  background: ${makeColor("neutral-dark")};
`;

export const LayoutFooter = forwardRef<HTMLElement, LayoutFooterProps>(
  function LayoutFooter({ children, className, ...restProps }, ref) {
    return (
      <footer {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </footer>
    );
  }
);
