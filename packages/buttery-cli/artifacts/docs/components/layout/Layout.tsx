import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { makeColor, makeCustom, makeFontFamily, makeRem } from "../../library";
import { LayoutProvider, type LayoutProviderProps } from "./Layout.context";
import { LayoutBodyMain } from "./LayoutBodyMain";
import { LayoutBodyNav } from "./LayoutBodyNav";
import { LayoutBodyTOC } from "./LayoutBodyTOC";
import { LayoutFooter } from "./LayoutFooter";
import { LayoutHeader } from "./LayoutHeader";

export const bodyCSS = css`
  font-family: ${makeFontFamily("body")};
  margin: 0;

  display: grid;
  min-height: 100vh;
  margin: 0 auto;
  // desktop
  grid-template-rows: ${makeCustom("layout-header-height")} auto auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    "layout-header"
    "layout-body"
    "layout-footer";

  pre {
    padding: ${makeRem(20)};
    overflow-x: auto;
    border-radius: ${makeRem(8)};
    font-size: ${makeRem(12)};

    .line {
      line-height: 1.5;
    }
  }
  background: ${makeColor("neutral", { variant: "50", opacity: 0.12 })};
`;

const LayoutBody = styled("main")`
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

export type LayoutProps = LayoutProviderProps;
export function Layout({ children, ...restProps }: LayoutProps) {
  return (
    <LayoutProvider {...restProps}>
      <LayoutHeader />
      <LayoutBody>
        <LayoutBodyNav />
        <LayoutBodyMain>{children}</LayoutBodyMain>
        <LayoutBodyTOC />
      </LayoutBody>
      <LayoutFooter />
    </LayoutProvider>
  );
}
