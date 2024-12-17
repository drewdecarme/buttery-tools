import type { UseTrackingNodeCallback } from "@buttery/components";
import { classes, useForwardedRef, useTrackingNode } from "@buttery/components";
import {
  makeColor,
  makeFontWeight,
  makePx,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef, useCallback } from "react";

export type NavTabsPropsNative = JSX.IntrinsicElements["nav"];
export type NavTabsProps = NavTabsPropsNative;

const styles = css`
  position: relative;

  ul {
    ${makeReset("ul")};

    display: flex;
    align-items: center;
    gap: ${makeRem(24)};
    border-bottom: ${makeRem(1)} solid
      ${makeColor("neutral-light", { opacity: 0.1 })};

    a {
      ${makeReset("anchor")};
    }
    button {
      ${makeReset("button")};
    }

    a,
    button {
      display: grid;
      place-content: center;
      height: ${makeRem(60)};
      font-size: ${makeRem(12)};
      text-transform: uppercase;
      font-weight: ${makeFontWeight("bold")};
      transition: all 0.15s ease-in-out;

      &.active {
        color: ${makeColor("primary-500")};
      }
    }
  }
`;

const divStyles = css`
  position: absolute;
  height: ${makeRem(2)};
  bottom: 0;
  background: ${makeColor("primary-500")};
  transition: all 0.2s ease-in-out;
`;

export const NavTabs = forwardRef<HTMLElement, NavTabsProps>(function NavTabs(
  { children, className, ...restProps },
  forwardedRef
) {
  const navRef = useForwardedRef(forwardedRef);

  const moveNode = useCallback<
    UseTrackingNodeCallback<HTMLDivElement, HTMLAnchorElement>
  >(
    (anchor, div) => {
      if (!navRef.current) return;

      // calculate the left position relative to the container and not the viewport
      // since this can be in a sticky container which would skew the anchorRect
      // calculations
      const containerRect = navRef.current.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const left = anchorRect.left - containerRect.left;

      div.style.left = makePx(left);
      div.style.width = makePx(anchorRect.width);
    },
    [navRef]
  );

  const divRef = useTrackingNode<HTMLDivElement, HTMLAnchorElement>(
    navRef,
    ".active",
    moveNode,
    { attributeFilter: ["class"] }
  );

  return (
    <nav {...restProps} className={classes(styles, className)} ref={navRef}>
      <div ref={divRef} className={divStyles} />
      {children}
    </nav>
  );
});
