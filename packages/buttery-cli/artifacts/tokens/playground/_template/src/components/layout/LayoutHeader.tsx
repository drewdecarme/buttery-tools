import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
} from "#buttery/tokens/playground";

export type LayoutHeaderPropsNative = JSX.IntrinsicElements["header"];
export type LayoutHeaderPropsCustom = {
  btLogoSrc: string;
  btLogoAlt: string;
};
export type LayoutHeaderProps = LayoutHeaderPropsNative &
  LayoutHeaderPropsCustom;

const SHeader = styled("header")`
  grid-area: layout-header;
  padding: 0 ${makeRem(16)};
  display: flex;
  align-items: center;
  border-bottom: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
  position: sticky;
  top: 0;
  background: #fff;
  justify-content: space-between;

  .title {
    font-family: ${makeFontFamily("body")};
    font-weight: ${makeFontWeight("bold")};
    font-size: ${makeRem(12)};
    text-transform: uppercase;
  }

  .logo {
    height: ${makeRem(64)};
    display: grid;
    place-items: center;
    position: sticky;
    top: 0;

    img {
      width: auto;
      height: ${makeRem(32)};
    }
  }

  & > div {
    display: flex;
    align-items: center;
    gap: ${makeRem(16)};

    &:last-child {
      a {
        height: ${makeRem(24)};
        color: ${makeColor("neutral")};
      }
    }
  }
`;

export const LayoutHeader = forwardRef<HTMLElement, LayoutHeaderProps>(
  function LayoutHeader(
    { children, className, btLogoAlt, btLogoSrc, ...restProps },
    ref
  ) {
    return (
      <SHeader {...restProps} className={clsx(className)} ref={ref}>
        <div>
          <NavLink to="/">
            <div className="logo">
              <img src={btLogoSrc} alt={btLogoAlt} />
            </div>
          </NavLink>
          <h1 className="title">buttery tokens</h1>
        </div>
        <div>{children}</div>
      </SHeader>
    );
  }
);
