import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "#buttery/tokens/playground";

export type LayoutNavPropsNative = JSX.IntrinsicElements["nav"];
export type LayoutNavPropsCustom = {
  btLogoSrc: string;
  btLogoAlt: string;
};
export type LayoutNavProps = LayoutNavPropsNative & LayoutNavPropsCustom;

const SNav = styled("nav")`
  grid-area: layout-side-nav;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${makeColor("neutral")};
  border-right: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
  position: sticky;
  top: 0;

  .logo {
    height: ${makeRem(64)};
    display: grid;
    place-items: center;
    position: sticky;
    top: 0;

    img {
      width: auto;
      height: ${makeRem(40)};
    }
  }

  ul {
    ${makeReset("ul")};
    display: flex;
    flex-direction: column;
    gap: ${makeRem(16)};
    padding: ${makeRem(32)} 0;
    position: sticky;
    top: ${makeRem(64)};

    li {
      a {
        height: ${makeRem(52)};
        width: ${makeRem(52)};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${makeRem(4)};

        font-size: ${makeRem(10)};
        font-weight: ${makeFontWeight("semi-bold")};
        color: ${makeColor("neutral", { variant: "50" })};
        text-transform: uppercase;
        border-radius: ${makeRem(8)};
        position: relative;
        text-decoration: none;

        &.active {
          color: ${makeColor("primary", { variant: "300" })};
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
        <div className="logo">
          <img src={btLogoSrc} alt={btLogoAlt} />
        </div>
        <ul>{children}</ul>
      </SNav>
    );
  }
);
