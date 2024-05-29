import { styled } from "@linaria/react";
import type { ReactNode } from "react";

import { localTokens } from "./tokens-local";

const SLayout = styled("div")`
  display: grid;
  grid-template-areas: 
    "layout-bar layout-side-nav layout-main"
    "layout-footer layout-footer layout-footer";
  grid-template-rows: 100vh auto;
  grid-template-columns: ${localTokens.makeRem(16)} minmax(
      min-content,
      max-content
    ) 1fr;
`;

const SLayoutBar = styled("div")`
  grid-area: layout-bar;
`;

const SLayoutSideNav = styled("nav")`
  grid-area: layout-side-nav;
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
      <SLayoutBar />
      <SLayoutSideNav>side-nav</SLayoutSideNav>
      <SLayoutMain>{children}</SLayoutMain>
      <SLayoutFooter>footer</SLayoutFooter>
    </SLayout>
  );
}
