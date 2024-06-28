import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeColor, makeRem, makeReset } from "#buttery/tokens/playground";

export type LayoutNavPropsNative = JSX.IntrinsicElements["nav"];
export type LayoutNavPropsCustom = Record<string, unknown>;
export type LayoutNavProps = LayoutNavPropsNative & LayoutNavPropsCustom;

const SNav = styled("nav")`
  grid-area: layout-side-nav;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
  position: sticky;
  top: 0;

  ul {
    ${makeReset("ul")};
    display: flex;
    flex-direction: column;
    gap: ${makeRem(16)};
    position: sticky;
    top: ${makeRem(60 + 16)};

    li {
      a {
        height: ${makeRem(24)};
        width: ${makeRem(24)};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${makeRem(4)};
        color: ${makeColor("neutral", { variant: "300" })};
        font-size: ${makeRem(24)};

        &.active {
          color: ${makeColor("neutral")};
        }
      }
    }
  }
`;

export const LayoutNav = forwardRef<HTMLElement, LayoutNavProps>(
  function LayoutNav(
    { children, className, btLogoAlt, btLogoSrc, ...restProps },
    ref
  ) {
    return (
      <SNav {...restProps} className={clsx(className)} ref={ref}>
        <ul>{children}</ul>
      </SNav>
    );
  }
);
