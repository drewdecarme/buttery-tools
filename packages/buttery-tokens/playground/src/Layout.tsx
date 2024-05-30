import { styled } from "@linaria/react";
import type { ReactNode } from "react";

import { Icon } from "./components/Icon";
import { generatedTokens } from "./tokens-generated";
import { localTokens } from "./tokens-local";

const SLayout = styled("div")`
  display: grid;
  grid-template-areas:
    "layout-bar layout-header layout-header"
    "layout-bar layout-side-nav layout-main"
    "layout-footer layout-footer layout-footer";
  grid-template-rows: ${localTokens.makeRem(48)} 100vh auto;
  grid-template-columns: ${localTokens.makeRem(8)} ${localTokens.makeRem(48)} 1fr;
`;

const SLayoutHeader = styled("header")`
  grid-area: layout-header;
  padding: 0 ${localTokens.makeRem(32)};
  display: flex;
  align-items: center;

  .title {
    font-family: ${localTokens.makeFontFamily("body")};
    font-weight: ${localTokens.makeFontWeight("bold")};
    font-size: ${localTokens.makeRem(12)};
    text-transform: uppercase;
  }
`;

const SLayoutBar = styled("div")`
  grid-area: layout-bar;
  background: ${generatedTokens.makeColor("primary")};
`;

const SLayoutSideNav = styled("nav")`
  grid-area: layout-side-nav;

  ul {
    display: flex;
    flex-direction: column;
    // TODO: create a makeReset
    padding: 0;
    margin: 0;

    li {
      padding: 0;
      margin: 0;
      list-style-type: none;
      
      height: ${localTokens.makeRem(48)};
      width: ${localTokens.makeRem(48)};
      display: grid;
      place-content: center;
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
      <SLayoutHeader>
        <h1 className="title">buttery tokens</h1>
      </SLayoutHeader>
      <SLayoutBar />
      <SLayoutSideNav>
        <ul>
          <li>
            <Icon icon="palette" />
          </li>
        </ul>
      </SLayoutSideNav>
      <SLayoutMain>{children}</SLayoutMain>
      <SLayoutFooter>footer</SLayoutFooter>
    </SLayout>
  );
}
