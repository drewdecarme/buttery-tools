import {
  makeColor,
  makeCustom,
  makeFontFamily,
  makeRem,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { LayoutProvider, type LayoutProviderProps } from "./Layout.context";
import { LayoutHeader } from "./LayoutHeader";

export const bodyCSS = css`
  font-family: ${makeFontFamily("body")};
  margin: 0;

  display: grid;
  min-height: 100vh;
  margin: 0 auto;
  // desktop
  grid-template-rows: ${makeCustom("layout-header-height")} auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    "layout-header"
    "layout-body";

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

export type LayoutProps = LayoutProviderProps;
export function Layout({ children, ...restProps }: LayoutProps) {
  return (
    <LayoutProvider {...restProps}>
      <LayoutHeader />
      {children}
    </LayoutProvider>
  );
}
