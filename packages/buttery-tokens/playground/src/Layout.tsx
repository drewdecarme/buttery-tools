import { styled } from "@linaria/react";
import type { ReactNode } from "react";

import { Icon } from "./components/icon/Icon";
import { localTokens } from "./tokens-local";

const SLayout = styled("div")`
  display: grid;
  grid-template-areas:
    "layout-side-nav  layout-header"
    "layout-side-nav   layout-main"
    "layout-footer  layout-footer";
  grid-template-rows: ${localTokens.makeRem(64)} 100vh auto;
  grid-template-columns: ${localTokens.makeRem(80)} 1fr;
`;

const SLayoutHeader = styled("header")`
  grid-area: layout-header;
  padding: 0 ${localTokens.makeRem(32)};
  display: flex;
  align-items: center;
  border-bottom: ${localTokens.makeRem(1)} solid
    ${localTokens.makeColor("neutral", { variant: "50" })};

  .title {
    font-family: ${localTokens.makeFontFamily("body")};
    font-weight: ${localTokens.makeFontWeight("bold")};
    font-size: ${localTokens.makeRem(12)};
    text-transform: uppercase;
  }
`;

const SLayoutSideNav = styled("nav")`
  grid-area: layout-side-nav;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${localTokens.makeColor("neutral")};
  border-right: ${localTokens.makeRem(1)} solid
    ${localTokens.makeColor("neutral", { variant: "50" })};

  .logo {
    height: ${localTokens.makeRem(64)};
    display: grid;
    place-items: center;

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

const SLayoutMain = styled("div")`
  grid-area: layout-main;
`;

const SLayoutFooter = styled("div")`
  grid-area: layout-footer;
`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <SLayout>
      <SLayoutSideNav>
        <div className="logo">
          <img
            src="/images/buttery-tokens-logo.png"
            alt="buttery-tokens-logo"
          />
        </div>
        <ul>
          <li>
            <a>
              <Icon icon="text-font-stroke-rounded" />
              <div>font</div>
            </a>
          </li>
          <li>
            <a className="active">
              <Icon icon="palette" />
              <div>color</div>
            </a>
          </li>
        </ul>
      </SLayoutSideNav>
      <SLayoutHeader>
        <h1 className="title">buttery tokens</h1>
      </SLayoutHeader>
      <SLayoutMain>{children}</SLayoutMain>
      <SLayoutFooter>footer</SLayoutFooter>
    </SLayout>
  );
}
