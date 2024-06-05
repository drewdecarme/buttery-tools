import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens-local";
import { forwardRef } from "react";

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
  background: ${localTokens.makeColor("neutral")};
  border-right: ${localTokens.makeRem(1)} solid
    ${localTokens.makeColor("neutral", { variant: "50" })};
  position: sticky;
  top: 0;

  .logo {
    height: ${localTokens.makeRem(64)};
    display: grid;
    place-items: center;
    position: sticky;
    top: 0;

    img {
      width: auto;
      height: ${localTokens.makeRem(40)};
    }
  }

  ul {
    ${localTokens.makeReset("ul")};
    display: flex;
    flex-direction: column;
    gap: ${localTokens.makeRem(16)};
    padding: ${localTokens.makeRem(32)} 0;
    position: sticky;
    top: ${localTokens.makeRem(64)};

    li {
      a {
        height: ${localTokens.makeRem(52)};
        width: ${localTokens.makeRem(52)};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${localTokens.makeRem(4)};

        font-size: ${localTokens.makeRem(10)};
        font-weight: ${localTokens.makeFontWeight("semi-bold")};
        color: ${localTokens.makeColor("neutral", { variant: "50" })};
        text-transform: uppercase;
        border-radius: ${localTokens.makeRem(8)};
        position: relative;

        &.active {
          color: ${localTokens.makeColor("primary", { variant: "300" })};
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
