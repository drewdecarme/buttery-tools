import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

export type LayoutNavPropsNative = JSX.IntrinsicElements["nav"];
export type LayoutNavPropsCustom = {
  btLogoSrc: string;
  btLogoAlt: string;
};
export type LayoutNavProps = LayoutNavPropsNative & LayoutNavPropsCustom;

const SNav = styled("nav")`
  grid-area: layout-nav;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${makeRem(16)};
  position: sticky;
  top: 0;
  background: ${makeColor("neutral", { variant: "50", opacity: 0.6 })};
  border-bottom: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};

  .title {
    display: flex;
    height: ${makeRem(64)};
    gap: ${makeRem(16)};
    align-items: center;
    text-decoration: none;
    justify-content: flex-start;
    width: 100%;

    img {
      width: auto;
      height: ${makeRem(40)};
    }
  }

  ul {
    ${makeReset("ul")};
    display: flex;
    flex-direction: column;
    gap: ${makeRem(8)};
    position: sticky;
    top: ${makeRem(60 + 16)};

    li {
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${makeRem(4)};
        color: ${makeColor("neutral")};
        font-size: ${makeRem(16)};
        gap: ${makeRem(8)};
        transition: all 0.15s ease-in-out;
        width: ${makeRem(44)};
        height: ${makeRem(44)};
        border-radius: ${makeRem(4)};
        text-decoration: none;
        /* border: ${makeRem(1)} solid transparent; */
        color: ${makeColor("neutral", { variant: "200" })};

        & > div {
          &:first-child {
            width: ${makeRem(20)};
            height: ${makeRem(20)};
          }
        }

        &:not(.active) {
          &:hover {
            color: ${makeColor("neutral")};
          }
        }

        &.active {
          color: ${makeColor("neutral")};
          background: ${makeColor("primary")};
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
        <NavLink to="/" className="title">
          <img src={btLogoSrc} alt={btLogoAlt} />
        </NavLink>
        <ul>{children}</ul>
      </SNav>
    );
  }
);
