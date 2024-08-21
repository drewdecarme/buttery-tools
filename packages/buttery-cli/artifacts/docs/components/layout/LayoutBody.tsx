import { makeCustom, makeRem } from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import type { ReactNode } from "react";
import { LayoutBodyMain } from "./LayoutBodyMain";
import { LayoutBodyNav } from "./LayoutBodyNav";
import { LayoutBodyTOC } from "./LayoutBodyTOC";

const bodyStyles = css`
  display: grid;
  grid-area: layout-body;
  grid-template-columns: ${makeRem(300)} 1fr ${makeRem(300)};
  grid-template-rows: 1fr;
  min-height: ${`calc(100vh - ${makeCustom("layout-header-height")})`};
  grid-template-areas: "layout-sidebar layout-main layout-toc";
  max-width: ${makeCustom("layout-max-width")};
  margin: 0 auto;
  width: 100%;
`;

export function LayoutBody(props: { children: ReactNode }) {
  return (
    <main className={bodyStyles}>
      <LayoutBodyNav />
      <LayoutBodyMain>{props.children}</LayoutBodyMain>
      <LayoutBodyTOC />
    </main>
  );
}
