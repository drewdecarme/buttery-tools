import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type LayoutHeaderNavPropsNative = JSX.IntrinsicElements["nav"];
export type LayoutHeaderNavProps = LayoutHeaderNavPropsNative;

const styles = css`
  ul {
    ${makeReset("ul")};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${makeRem(16)};
  }

  a {
    ${makeReset("anchor")};
    font-size: ${makeRem(16)};
    text-transform: uppercase;
    letter-spacing: -1px;
    font-weight: ${makeFontWeight("medium")};

    &.active {
      color: ${makeColor("secondary-600")};
    }
  }
`;

export const LayoutHeaderNav = forwardRef<HTMLElement, LayoutHeaderNavProps>(
  function LayoutHeaderNav({ children, className, ...restProps }, ref) {
    return (
      <nav {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </nav>
    );
  }
);
