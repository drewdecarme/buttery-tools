import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type NavTabsPropsNative = JSX.IntrinsicElements["nav"];
export type NavTabsProps = NavTabsPropsNative;

const styles = css`
  ul {
    ${makeReset("ul")};

    display: flex;
    align-items: center;
    gap: ${makeRem(24)};
    border-bottom: ${makeRem(1)} solid
      ${makeColor("neutral-light", { opacity: 0.1 })};

    a {
      ${makeReset("anchor")};
      display: grid;
      place-content: center;
      height: ${makeRem(60)};
      font-size: ${makeRem(12)};
      text-transform: uppercase;
      font-weight: ${makeFontWeight("semi-bold")};
      transition: all 0.15s ease-in-out;

      &.active {
        color: ${makeColor("primary-100")};
      }
    }
  }
`;

export const NavTabs = forwardRef<HTMLElement, NavTabsProps>(function NavTabs(
  { children, className, ...restProps },
  ref
) {
  return (
    <nav {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </nav>
  );
});
