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
      display: grid;
      place-content: center;
      height: ${makeRem(60)};
      font-size: ${makeRem(12)};
      text-transform: uppercase;
      font-weight: ${makeFontWeight("bold")};
      transition: all 0.15s ease-in-out;

      &.active {
        color: ${makeColor("primary-100")};
      }
    }
  }
`;

const divStyles = css`
  position: absolute;
  height: ${makeRem(2)};
  bottom: 0;
  background: ${makeColor("primary-100")};
  transition: all 0.2s ease-in-out;
`;

export const NavTabs = forwardRef<HTMLElement, NavTabsProps>(function NavTabs(
  { children, className, ...restProps },
  forwardedRef
) {
  const navRef = useForwardedRef(forwardedRef);

  const moveNode = useCallback<
    UseTrackingNodeCallback<HTMLDivElement, HTMLAnchorElement>
  >((anchor, div) => {
    if (!navRef.current) return;

    const rect = anchor.getBoundingClientRect();
    div.style.left = makePx(rect.left - navRef.current.offsetLeft);
    div.style.width = makePx(rect.width);
  }, []);

  const divRef = useTrackingNode<HTMLDivElement, HTMLAnchorElement>(
    navRef,
    "a.active",
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
